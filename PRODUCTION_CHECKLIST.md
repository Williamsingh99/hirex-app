# ✅ HireX Production Launch Checklist

## 🎯 Pre-Launch Phase (Week 1-2)

### Infrastructure Setup
- [ ] **Supabase Project Created**
  - [ ] Project URL: `https://iuzysbqdqdmkyebgmdno.supabase.co`
  - [ ] All migrations run successfully
  - [ ] RLS policies enabled on all tables
  - [ ] Storage bucket `resumes` created
  - [ ] Google OAuth enabled in Authentication

- [ ] **Stripe Account Setup**
  - [ ] Stripe account verified
  - [ ] Products created (Free, Pro, Enterprise)
  - [ ] Prices configured
  - [ ] Webhook endpoint added: `https://hirex.ai/api/stripe/webhook`
  - [ ] Webhook secret copied to `.env.local`
  - [ ] Test mode keys in `.env.local`
  - [ ] Live mode keys ready for production

- [ ] **NVIDIA NIM API**
  - [ ] API key obtained from https://build.nvidia.com
  - [ ] Rate limits understood ($0.0001/1K tokens approx)
  - [ ] Fallback model identified

- [ ] **Browserless Account**
  - [ ] Account created at https://browserless.io
  - [ ] Token obtained
  - [ ] Tested connection locally
  - [ ] 500 minutes/month plan sufficient for beta

- [ ] **Google Cloud Project**
  - [ ] Project created
  - [ ] Gmail API enabled
  - [ ] OAuth consent screen configured
  - [ ] OAuth credentials created
  - [ ] Redirect URI: `https://hirex.ai/auth/google/callback`

- [ ] **Domain & Hosting**
  - [ ] Domain purchased (hirex.ai or similar)
  - [ ] Vercel project created
  - [ ] Domain connected to Vercel
  - [ ] SSL certificate active
  - [ ] DNS records propagated

### Environment Variables
- [ ] All variables from `.env.example` set in Vercel
- [ ] No `NEXT_PUBLIC_` variables contain secrets
- [ ] Different values for production vs preview environments

### Database
- [ ] Migration `001_initial_schema.sql` run
- [ ] Migration `20260501000000_phase2_subscriptions.sql` run
- [ ] Indexes created for performance
- [ ] Test data inserted for QA
- [ ] Database backups enabled

---

## 🔨 Development Phase (Week 2-3)

### Code Quality
- [ ] Remove all `@ts-nocheck` directives
  - [ ] `app/(dashboard)/dashboard/page.tsx`
  - [ ] `app/(dashboard)/dashboard/portals/page.tsx`
  - [ ] `app/(dashboard)/dashboard/resume/page.tsx`
- [ ] Fix all TypeScript errors
- [ ] Complete `lib/automation/applyAgent.ts` implementation
- [ ] Remove all mock data from production code
- [ ] Add proper error handling to all API routes
- [ ] Implement retry logic for failed API calls

### Security
- [ ] Rate limiting middleware enabled
- [ ] All user inputs validated (Zod schemas)
- [ ] SQL injection prevention (using Supabase parameterized queries)
- [ ] XSS prevention (React escapes by default, but verify)
- [ ] CSRF protection enabled
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Credentials encrypted before storage
- [ ] API keys hashed before storage

### Testing
- [ ] Install test dependencies: `npm install`
- [ ] Run unit tests: `npm test`
  - [ ] Encryption tests passing
  - [ ] Usage tracking tests passing
  - [ ] AI config tests passing
- [ ] Run E2E tests: `npm run test:e2e`
  - [ ] Authentication flow
  - [ ] Job application flow
  - [ ] Payment flow
  - [ ] AI features
- [ ] Code coverage > 80%
- [ ] Fix all critical bugs found

### Performance
- [ ] Run Lighthouse audit
  - [ ] Performance score > 90
  - [ ] Accessibility score > 90
  - [ ] Best Practices score > 90
  - [ ] SEO score > 90
- [ ] Optimize images (use Next.js Image component)
- [ ] Enable code splitting
- [ ] Lazy load heavy components
- [ ] Database queries optimized (check with EXPLAIN ANALYZE)
- [ ] Add caching headers where appropriate

---

## 🧪 QA Phase (Week 3)

### Manual Testing

#### Authentication
- [ ] Google OAuth login works
- [ ] Session persists across page reloads
- [ ] Logout clears session properly
- [ ] Protected routes redirect to login
- [ ] Authenticated users can't access login page

#### Payments
- [ ] Free tier user can view pricing
- [ ] Checkout flow redirects to Stripe
- [ ] Stripe payment succeeds in test mode
- [ ] Webhook updates subscription status
- [ ] Pro features unlock after payment
- [ ] Cancellation downgrades to free tier
- [ ] Failed payments handled gracefully

#### Job Applications
- [ ] Jobs feed displays real data from Supabase
- [ ] Queue job creates application record
- [ ] Application status updates correctly
- [ ] Automation runs via Browserless
- [ ] Failed applications logged properly

#### Resume Features
- [ ] PDF upload works
- [ ] ATS scoring returns valid score (0-100)
- [ ] Missing skills identified correctly
- [ ] Optimization suggestions helpful
- [ ] Multiple resumes can be uploaded

#### AI Features
- [ ] Smart reply generates 3 distinct drafts
- [ ] Drafts are professional and relevant
- [ ] "Use this reply" button works
- [ ] AI doesn't hallucinate information

#### Portal Connections
- [ ] LinkedIn connection flow works
- [ ] Indeed connection flow works
- [ ] Naukri connection flow works
- [ ] Credentials stored encrypted
- [ ] Sync button fetches new jobs

### Edge Cases
- [ ] Network failures handled gracefully
- [ ] API timeouts show proper error messages
- [ ] Invalid file uploads rejected
- [ ] Duplicate applications prevented
- [ ] Rate limit errors shown to user
- [ ] Subscription expired - features locked
- [ ] User deletes account - data purged

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 🚀 Launch Phase (Week 4)

### Pre-Launch (3 days before)
- [ ] Final code review completed
- [ ] All tests passing
- [ ] No critical bugs in Sentry
- [ ] Database backup taken
- [ ] Rollback plan documented
- [ ] Support team trained
- [ ] Launch announcement drafted

### Launch Day
- [ ] Deploy to production: `vercel --prod`
- [ ] Verify all environment variables set
- [ ] Run smoke tests on production
  - [ ] Login works
  - [ ] Payment flow works
  - [ ] Job application works
  - [ ] AI features work
- [ ] Monitor error logs (Sentry)
- [ ] Monitor server performance (Vercel Analytics)
- [ ] Monitor database performance (Supabase Dashboard)
- [ ] Send launch announcement
  - [ ] Product Hunt post live
  - [ ] Twitter/X announcement
  - [ ] LinkedIn post
  - [ ] Email to beta users

### Post-Launch (First Week)
- [ ] Daily monitoring:
  - [ ] Error rate < 1%
  - [ ] API response time < 500ms
  - [ ] Database query time < 100ms
  - [ ] Automation success rate > 90%
- [ ] Respond to support tickets within 2 hours
- [ ] Fix critical bugs within 24 hours
- [ ] Collect user feedback
- [ ] Track key metrics:
  - [ ] Signups per day
  - [ ] Conversion rate (free → pro)
  - [ ] Churn rate
  - [ ] MRR (Monthly Recurring Revenue)

---

## 📊 Success Metrics

### Week 1 Targets
- [ ] 100 signups
- [ ] 5 paying customers
- [ ] < 5% error rate
- [ ] > 80% automation success rate

### Month 1 Targets
- [ ] 500 signups
- [ ] 50 paying customers
- [ ] $1,500 MRR
- [ ] < 2% churn rate
- [ ] > 90% automation success rate

### Month 3 Targets
- [ ] 2,000 signups
- [ ] 200 paying customers
- [ ] $6,000 MRR
- [ ] < 3% churn rate
- [ ] > 95% automation success rate

---

## 🆘 Emergency Rollback Plan

If critical issues occur post-launch:

1. **Identify the issue**
   - Check Sentry for errors
   - Check Vercel logs
   - Check Supabase logs

2. **Immediate actions**
   - If database issue: Run rollback migration
   - If code issue: Revert to previous Vercel deployment
   - If payment issue: Disable checkout temporarily

3. **Communication**
   - Post status update on website
   - Email affected users
   - Update social media

4. **Fix and redeploy**
   - Fix issue in development
   - Test thoroughly
   - Deploy to preview
   - Test on preview
   - Deploy to production

---

## 📞 Support & Maintenance

### Daily Tasks
- [ ] Check Sentry for new errors
- [ ] Review automation success rate
- [ ] Respond to support tickets
- [ ] Monitor server costs

### Weekly Tasks
- [ ] Review user feedback
- [ ] Optimize slow database queries
- [ ] Update AI prompts if needed
- [ ] Security audit (dependencies, vulnerabilities)

### Monthly Tasks
- [ ] Financial review (MRR, expenses, profit)
- [ ] Performance review (response times, uptime)
- [ ] Feature planning for next month
- [ ] Update documentation

---

## 🎉 Launch Checklist Complete!

Once all items are checked:
- ✅ You have a production-ready SaaS
- ✅ Payment system is live
- ✅ Automation is working
- ✅ Monitoring is active
- ✅ Support process is in place

**Time to launch! 🚀**

---

**Last Updated:** May 1, 2026  
**Version:** 1.0.0  
**Status:** Ready for Production
