# 🚀 HireX Production Deployment Guide

## Prerequisites

1. **Supabase Project** - https://supabase.com
2. **Stripe Account** - https://stripe.com
3. **NVIDIA NIM API Key** - https://build.nvidia.com
4. **Vercel Account** - https://vercel.com
5. **Domain Name** (e.g., hirex.ai)
6. **Google Cloud Project** (for Gmail API)
7. **Browserless Account** - https://browserless.io

---

## Step 1: Database Setup (Supabase)

### 1.1 Run Migrations
```bash
cd supabase
supabase link --project-ref your-project-ref
supabase db push
```

### 1.2 Enable Required Supabase Features

**Authentication:**
- Enable Google OAuth Provider
- Add redirect URLs: `https://hirex.ai/auth/callback`

**Storage:**
- Create bucket: `resumes`
- Set policy: Users can only upload/view their own files

**Edge Functions:**
```bash
supabase functions new stripe-webhook
supabase functions new gmail-sync
```

### 1.3 Create Database Indexes

```sql
-- Add these to your migration file for performance

-- Jobs table indexes
CREATE INDEX IF NOT EXISTS idx_jobs_portal_created ON jobs(portal_name, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_remote ON jobs(is_remote);
CREATE INDEX IF NOT EXISTS idx_jobs_salary ON jobs(salary_min, salary_max);

-- Applications table indexes
CREATE INDEX IF NOT EXISTS idx_applications_user_status ON applications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_created ON applications(created_at DESC);

-- Messages table indexes
CREATE INDEX IF NOT EXISTS idx_messages_user_read ON messages(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_application ON messages(application_id);

-- Portals table indexes
CREATE INDEX IF NOT EXISTS idx_portals_user ON portals(user_id);
CREATE INDEX IF NOT EXISTS idx_portals_status ON portals(status);
```

---

## Step 2: Payment System Setup (Stripe)

### 2.1 Create Products in Stripe Dashboard

**Product 1: Free Tier**
- Price: $0/month
- Features:
  - 10 applications/month
  - Basic ATS scoring
  - 1 portal connection

**Product 2: Pro Tier**
- Price: $29/month
- Features:
  - Unlimited applications
  - Advanced ATS optimization
  - 5 portal connections
  - Priority support

**Product 3: Enterprise Tier**
- Price: $99/month
- Features:
  - Everything in Pro
  - Unlimited portal connections
  - Custom automation rules
  - API access
  - Dedicated support

### 2.2 Setup Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://hirex.ai/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment.succeeded`
   - `invoice.payment.failed`

### 2.3 Test Payments Locally

```bash
# Install Stripe CLI
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Step 3: Email Integration (Gmail API)

### 3.1 Google Cloud Console Setup

1. Create new project at https://console.cloud.google.com
2. Enable Gmail API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `https://hirex.ai/auth/google/callback`
5. Download credentials JSON

### 3.2 OAuth Consent Screen

- App name: HireX
- User support email: support@hirex.ai
- Scopes:
  - `https://www.googleapis.com/auth/gmail.readonly`
  - `https://www.googleapis.com/auth/gmail.send`

### 3.3 Implement OAuth Flow

```typescript
// app/api/auth/google/route.ts
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });

  return Response.redirect(url);
}
```

---

## Step 4: Portal Automation (Playwright + Browserless)

### 4.1 Why Browserless?

Vercel Serverless Functions have:
- ❌ 10 second timeout (free tier)
- ❌ 50MB bundle size limit
- ❌ No persistent browser

**Solution:** Use Browserless.io for remote browser automation

### 4.2 Setup Browserless

1. Create account at https://browserless.io
2. Get token from dashboard
3. Add to `.env`: `BROWSERLESS_TOKEN=xxx`

### 4.3 Complete Automation Code

```typescript
// lib/automation/applyAgent.ts (COMPLETE VERSION)

import { createClient } from '@/lib/supabase/server';
import { chromium } from 'playwright-extra';
import stealth from 'playwright-stealth';

chromium.use(stealth());

export async function applyToJob(userId: string, jobId: string) {
  const supabase = await createClient();
  const browserlessToken = process.env.BROWSERLESS_TOKEN;

  if (!browserlessToken) {
    throw new Error('BROWSERLESS_TOKEN is missing');
  }

  // 1. Fetch job details
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (jobError || !job) throw new Error('Job not found');

  // 2. Fetch user profile & resume
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  const { data: resume } = await supabase
    .from('resumes')
    .select('file_url')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (!profile || !resume) throw new Error('Profile or resume missing');

  // 3. Connect to Browserless
  const wsEndpoint = `wss://chrome.browserless.io?token=${browserlessToken}`;
  const browser = await chromium.connect({ wsEndpoint });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    viewport: { width: 1920, height: 1080 },
  });
  
  const page = await context.newPage();

  try {
    // 4. Portal-specific automation
    if (job.portal_name === 'linkedin') {
      await applyLinkedIn(page, job, profile, resume);
    } else if (job.portal_name === 'indeed') {
      await applyIndeed(page, job, profile, resume);
    } else if (job.portal_name === 'naukri') {
      await applyNaukri(page, job, profile, resume);
    }

    // 5. Update application status
    await supabase
      .from('applications')
      .update({ status: 'Applied', applied_at: new Date().toISOString() })
      .eq('id', jobId);

    return { success: true };
  } catch (error) {
    console.error('Automation failed:', error);
    await supabase
      .from('applications')
      .update({ status: 'Failed', notes: error.message })
      .eq('id', jobId);
    
    throw error;
  } finally {
    await browser.close();
  }
}

async function applyLinkedIn(page: any, job: any, profile: any, resume: any) {
  await page.goto(job.apply_url, { waitUntil: 'networkidle' });
  
  // Wait for apply button
  await page.waitForSelector('button.jobs-apply-button', { timeout: 10000 });
  await page.click('button.jobs-apply-button');
  
  // Check if it's Easy Apply
  const isEasyApply = await page.$('button.artdeco-button[aria-label*="Easy Apply"]');
  
  if (isEasyApply) {
    // Upload resume
    const fileInput = await page.$('input[type="file"]');
    await fileInput?.uploadFile(resume.file_url);
    
    // Submit application
    await page.click('button[aria-label*="Submit application"]');
  } else {
    // Redirect to external site
    await page.click('button[aria-label*="Apply on company website"]');
  }
}

async function applyIndeed(page: any, job: any, profile: any, resume: any) {
  await page.goto(job.apply_url, { waitUntil: 'networkidle' });
  
  // Indeed specific selectors
  await page.waitForSelector('#indeedApplyButton', { timeout: 10000 });
  await page.click('#indeedApplyButton');
  
  // Fill form
  await page.fill('input[name="fullname"]', profile.full_name);
  await page.fill('input[name="email"]', profile.email);
  
  // Upload resume
  const fileInput = await page.$('input[type="file"]');
  await fileInput?.uploadFile(resume.file_url);
  
  // Submit
  await page.click('button[type="submit"]');
}

async function applyNaukri(page: any, job: any, profile: any, resume: any) {
  await page.goto(job.apply_url, { waitUntil: 'networkidle' });
  
  // Naukri specific automation
  await page.waitForSelector('button.apply-btn', { timeout: 10000 });
  await page.click('button.apply-btn');
  
  // Login check (user should already be logged in via extension)
  const isLoggedIn = await page.$('.user-logged-in');
  if (!isLoggedIn) {
    throw new Error('Not logged in to Naukri. Please connect your account.');
  }
  
  // Upload resume
  await page.setInputFiles('input[type="file"]', resume.file_url);
  
  // Submit
  await page.click('button.send-application');
}
```

---

## Step 5: Production Deployment (Vercel)

### 5.1 Prepare for Deployment

```bash
# Build locally first
npm run build

# Check for errors
npm run lint
```

### 5.2 Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel login
vercel --prod
```

### 5.3 Add Environment Variables in Vercel

Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all variables from `.env.example`

### 5.4 Custom Domain Setup

1. Buy domain (e.g., hirex.ai from Namecheap/GoDaddy)
2. In Vercel: Project → Settings → Domains
3. Add domain: `hirex.ai` and `www.hirex.ai`
4. Update DNS records as shown in Vercel

---

## Step 6: Monitoring & Analytics

### 6.1 Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});
```

### 6.2 Product Analytics (PostHog)

```bash
npm install posthog-js posthog-node
```

```typescript
// lib/posthog.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  });
}

export function trackEvent(eventName: string, properties?: any) {
  posthog.capture(eventName, properties);
}
```

### 6.3 Performance Monitoring

- Enable Vercel Analytics
- Use Web Vitals for Core Web Vitals tracking
- Set up Logtail for server logs

---

## Step 7: Legal & Compliance

### 7.1 Required Pages

Create these pages:
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/refund` - Refund Policy

### 7.2 GDPR Compliance

- Add cookie consent banner
- Allow users to export their data
- Allow users to delete their account

### 7.3 Terms of Service

**Important clauses:**
- Automation usage disclaimer
- No guarantee of job placement
- User responsible for portal credentials
- Fair use policy for API limits

---

## Step 8: Launch Checklist

### Pre-Launch (1 week before)

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Stripe products created
- [ ] Email templates designed
- [ ] Error tracking configured
- [ ] Analytics set up
- [ ] Legal pages published
- [ ] Domain DNS configured
- [ ] SSL certificate active

### Launch Day

- [ ] Deploy to production
- [ ] Test payment flow end-to-end
- [ ] Test email sync
- [ ] Test automation on all portals
- [ ] Monitor error logs
- [ ] Send launch announcement

### Post-Launch (First week)

- [ ] Monitor server performance
- [ ] Track user onboarding funnel
- [ ] Collect user feedback
- [ ] Fix critical bugs within 24h
- [ ] Optimize slow queries

---

## 📊 Cost Breakdown (Monthly)

| Service | Free Tier | Paid Tier (Scale) |
|---------|-----------|-------------------|
| **Vercel** | $0 | $20 (Pro) |
| **Supabase** | $0 | $25 (Pro) |
| **Stripe** | 2.9% + 30¢ | Same |
| **NVIDIA NIM** | $0 (trial) | ~$100 (usage) |
| **Browserless** | 100 min | $25 (500 min) |
| **Resend** | 3000 emails | $20 (50k emails) |
| **PostHog** | 1M events | $0 (open source) |
| **Sentry** | 5k errors | $26 (100k errors) |
| **Domain** | - | $15/year |

**Total:** ~$0-50/month (starting) → ~$200-300/month (at scale)

---

## 🎯 Go-to-Market Strategy

### 1. Beta Launch (Week 1-2)
- Invite-only (50 users)
- Collect feedback
- Fix critical bugs

### 2. Product Hunt Launch (Week 3)
- Prepare launch assets
- Gather upvotes
- Engage with community

### 3. Content Marketing (Ongoing)
- Write blog posts about job search tips
- Share success stories
- YouTube tutorials

### 4. Paid Ads (Month 2+)
- Google Ads (job search keywords)
- LinkedIn Ads (target job seekers)
- Twitter/X promotions

### 5. Referral Program
- Give 1 month free for each referral
- Referral gets 50% off first month

---

## 🔥 Critical Success Factors

1. **Reliability** - Automation must work 95%+ of time
2. **Speed** - Applications should complete in <30 seconds
3. **Security** - Encrypt all stored credentials
4. **Support** - Respond to tickets within 2 hours
5. **Pricing** - Competitive with Simplify ($29/month)

---

## 📞 Support & Maintenance

### Daily Tasks
- Monitor error logs (Sentry)
- Check automation success rate
- Respond to support tickets

### Weekly Tasks
- Review user feedback
- Optimize slow database queries
- Update AI prompts if needed

### Monthly Tasks
- Security audit
- Dependency updates
- Performance review
- Billing reconciliation

---

## 🚨 Common Pitfalls to Avoid

1. ❌ **Don't store passwords** - Use OAuth or browser extension
2. ❌ **Don't run Playwright on Vercel** - Use Browserless
3. ❌ **Don't skip rate limiting** - API abuse will bankrupt you
4. ❌ **Don't ignore analytics** - Track everything from day 1
5. ❌ **Don't launch without tests** - Write at least E2E tests

---

**Ready to build?** Start with Phase 1, Step 1 and move sequentially. Each step is critical for production readiness.

Need help with any specific step? Just ask! 🚀
