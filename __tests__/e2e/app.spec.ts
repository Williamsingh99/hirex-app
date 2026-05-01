import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
  });

  test('should login with Google and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    
    // Click Google login button
    await page.click('button:has-text("Continue with Google")');
    
    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
});

test.describe('Job Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    await page.waitForURL(/.*dashboard/);
  });

  test('should fetch and display jobs', async ({ page }) => {
    await page.goto('/dashboard/jobs');
    
    // Wait for jobs to load
    await page.waitForSelector('[data-testid="job-card"]', { timeout: 10000 });
    
    // Verify jobs are displayed
    const jobCards = await page.$$('[data-testid="job-card"]');
    expect(jobCards.length).toBeGreaterThan(0);
  });

  test('should queue a job for application', async ({ page }) => {
    await page.goto('/dashboard/jobs');
    
    // Wait for first job card
    await page.waitForSelector('[data-testid="job-card"]', { timeout: 10000 });
    
    // Click queue button on first job
    await page.click('[data-testid="queue-button"]:first-of-type');
    
    // Verify success toast
    await expect(page.locator('[data-toast="success"]')).toBeVisible();
  });

  test('should view applications history', async ({ page }) => {
    await page.goto('/dashboard/applications');
    
    // Wait for applications table
    await page.waitForSelector('[data-testid="application-row"]', { timeout: 10000 });
    
    // Verify applications are displayed
    const applicationRows = await page.$$('[data-testid="application-row"]');
    expect(applicationRows.length).toBeGreaterThan(0);
  });
});

test.describe('Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    await page.waitForURL(/.*dashboard/);
  });

  test('should display pricing plans', async ({ page }) => {
    await page.goto('/dashboard/pricing');
    
    // Wait for pricing cards
    await page.waitForSelector('[data-testid="pricing-card"]', { timeout: 10000 });
    
    // Verify all three plans are displayed
    const pricingCards = await page.$$('[data-testid="pricing-card"]');
    expect(pricingCards.length).toBe(3);
  });

  test('should initiate checkout for Pro plan', async ({ page }) => {
    await page.goto('/dashboard/pricing');
    
    // Click Pro plan checkout button
    await page.click('[data-testid="checkout-pro"]');
    
    // Should redirect to Stripe Checkout
    await page.waitForURL(/.*stripe.com/);
  });
});

test.describe('AI Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.click('button:has-text("Continue with Google")');
    await page.waitForURL(/.*dashboard/);
  });

  test('should generate ATS score for resume', async ({ page }) => {
    await page.goto('/dashboard/resume');
    
    // Upload resume (mock file)
    const fileInput = await page.$('input[type="file"]');
    await fileInput?.setInputFiles('test-fixtures/resume.pdf');
    
    // Wait for ATS score
    await page.waitForSelector('[data-testid="ats-score"]', { timeout: 15000 });
    
    // Verify score is displayed
    const scoreElement = await page.$('[data-testid="ats-score"]');
    expect(scoreElement).toBeTruthy();
  });

  test('should generate smart reply drafts', async ({ page }) => {
    await page.goto('/dashboard/inbox');
    
    // Wait for messages
    await page.waitForSelector('[data-testid="message-item"]', { timeout: 10000 });
    
    // Click on first message
    await page.click('[data-testid="message-item"]:first-of-type');
    
    // Click generate drafts button
    await page.click('[data-testid="generate-drafts"]');
    
    // Wait for drafts
    await page.waitForSelector('[data-testid="draft-card"]', { timeout: 15000 });
    
    // Verify 3 drafts are generated
    const draftCards = await page.$$('[data-testid="draft-card"]');
    expect(draftCards.length).toBe(3);
  });
});
