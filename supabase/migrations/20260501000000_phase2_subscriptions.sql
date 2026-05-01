-- Phase 2: Subscription Management for SaaS
-- This migration adds subscription tracking and usage limits

-- 5. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan TEXT NOT NULL DEFAULT 'free', -- 'free', 'pro', 'enterprise'
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'canceled', 'past_due', 'trialing'
    current_period_end TIMESTAMPTZ,
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Usage Tracking Table
CREATE TABLE IF NOT EXISTS usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature TEXT NOT NULL, -- 'applications', 'portal_connections', 'ai_queries'
    used_count INTEGER DEFAULT 0,
    limit_count INTEGER NOT NULL,
    period_start DATE NOT NULL DEFAULT CURRENT_DATE,
    period_end DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, feature, period_start)
);

-- 7. API Keys Table (for Enterprise users)
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_usage_user_feature ON usage_tracking(user_id, feature);
CREATE INDEX IF NOT EXISTS idx_usage_period ON usage_tracking(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Subscriptions: Users can only view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Usage: Users can only view their own usage
CREATE POLICY "Users can view own usage"
ON usage_tracking FOR SELECT
USING (auth.uid() = user_id);

-- API Keys: Users can manage their own API keys
CREATE POLICY "Users can manage own API keys"
ON api_keys FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to check usage limits
CREATE OR REPLACE FUNCTION check_usage_limit(feature_name TEXT, max_allowed INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
BEGIN
  SELECT COALESCE(SUM(used_count), 0) INTO current_usage
  FROM usage_tracking
  WHERE user_id = auth.uid()
    AND feature = feature_name
    AND period_start <= CURRENT_DATE
    AND period_end >= CURRENT_DATE;
  
  RETURN current_usage < max_allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(feature_name TEXT, increment INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, feature, used_count, limit_count, period_start, period_end)
  VALUES (
    auth.uid(),
    feature_name,
    increment,
    CASE 
      WHEN (SELECT plan FROM profiles WHERE id = auth.uid()) = 'free' THEN 10
      WHEN (SELECT plan FROM profiles WHERE id = auth.uid()) = 'pro' THEN 999999
      ELSE 999999
    END,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '1 month'
  )
  ON CONFLICT (user_id, feature, period_start)
  DO UPDATE SET 
    used_count = usage_tracking.used_count + increment,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
