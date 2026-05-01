import posthog from 'posthog-js';

let posthogClient: typeof posthog | null = null;

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug(false);
      }
    },
  });
  
  posthogClient = posthog;
}

export function identifyUser(userId: string, email?: string) {
  if (posthogClient) {
    posthogClient.identify(userId, {
      email,
    });
  }
}

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (posthogClient) {
    posthogClient.capture(eventName, properties);
  }
}

export function resetUser() {
  if (posthogClient) {
    posthogClient.reset();
  }
}

// Common event names for consistency
export const EVENTS = {
  // Authentication
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',
  
  // Job Applications
  JOB_VIEWED: 'job_viewed',
  JOB_QUEUED: 'job_queued',
  JOB_APPLIED: 'job_applied',
  APPLICATION_FAILED: 'application_failed',
  
  // Resume
  RESUME_UPLOADED: 'resume_uploaded',
  ATS_SCORE_GENERATED: 'ats_score_generated',
  RESUME_OPTIMIZED: 'resume_optimized',
  
  // AI Features
  AI_REPLY_GENERATED: 'ai_reply_generated',
  AI_REPLY_USED: 'ai_reply_used',
  
  // Portal Connections
  PORTAL_CONNECTED: 'portal_connected',
  PORTAL_DISCONNECTED: 'portal_disconnected',
  PORTAL_SYNCED: 'portal_synced',
  
  // Payments
  CHECKOUT_STARTED: 'checkout_started',
  CHECKOUT_COMPLETED: 'checkout_completed',
  CHECKOUT_FAILED: 'checkout_failed',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  
  // Messages
  MESSAGE_VIEWED: 'message_viewed',
  MESSAGE_REPLIED: 'message_replied',
  
  // Errors
  ERROR_OCCURRED: 'error_occurred',
} as const;
