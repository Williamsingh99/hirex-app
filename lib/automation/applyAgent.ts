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
    } else {
      throw new Error(`Unsupported portal: ${job.portal_name}`);
    }

    // 5. Update application status
    await supabase
      .from('applications')
      .update({ 
        status: 'Applied', 
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);

    return { success: true, message: 'Application submitted successfully' };
  } catch (error: any) {
    console.error('Automation failed:', error);
    await supabase
      .from('applications')
      .update({ 
        status: 'Failed', 
        notes: error.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId);
    
    throw error;
  } finally {
    await browser.close();
  }
}

async function applyLinkedIn(page: any, job: any, profile: any, resume: any) {
  await page.goto(job.apply_url, { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for apply button
  await page.waitForSelector('button.jobs-apply-button', { timeout: 10000 });
  await page.click('button.jobs-apply-button');
  
  // Check if it's Easy Apply
  const isEasyApply = await page.$('button.artdeco-button[aria-label*="Easy Apply"]');
  
  if (isEasyApply) {
    // Upload resume
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
      await fileInput.setInputFiles(resume.file_url);
    }
    
    // Fill any form fields
    await page.fill('input[aria-label*="First name"]', profile.full_name.split(' ')[0] || '');
    await page.fill('input[aria-label*="Last name"]', profile.full_name.split(' ')[1] || '');
    await page.fill('input[aria-label*="Email"]', profile.email || '');
    await page.fill('input[aria-label*="Phone"]', profile.phone || '');
    
    // Submit application
    const submitButton = await page.$('button[aria-label*="Submit application"]');
    if (submitButton) {
      await submitButton.click();
    } else {
      // Click next through forms
      const nextButton = await page.$('button[aria-label*="Next"]');
      if (nextButton) {
        await nextButton.click();
        await page.waitForTimeout(2000);
        const finalSubmit = await page.$('button[aria-label*="Submit"]');
        if (finalSubmit) await finalSubmit.click();
      }
    }
  } else {
    // Redirect to external site
    const externalButton = await page.$('button[aria-label*="Apply on company website"]');
    if (externalButton) {
      await externalButton.click();
    }
  }
}

async function applyIndeed(page: any, job: any, profile: any, resume: any) {
  await page.goto(job.apply_url, { waitUntil: 'networkidle', timeout: 30000 });
  
  // Indeed specific selectors
  await page.waitForSelector('#indeedApplyButton', { timeout: 10000 });
  await page.click('#indeedApplyButton');
  
  // Fill form
  if (await page.$('input[name="fullname"]')) {
    await page.fill('input[name="fullname"]', profile.full_name);
  }
  if (await page.$('input[name="email"]')) {
    await page.fill('input[name="email"]', profile.email || '');
  }
  if (await page.$('input[name="phone"]')) {
    await page.fill('input[name="phone"]', profile.phone || '');
  }
  
  // Upload resume
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(resume.file_url);
  }
  
  // Submit
  const submitButton = await page.$('button[type="submit"]');
  if (submitButton) {
    await submitButton.click();
  }
}

async function applyNaukri(page: any, job: any, profile: any, resume: any) {
  await page.goto(job.apply_url, { waitUntil: 'networkidle', timeout: 30000 });
  
  // Naukri specific automation
  await page.waitForSelector('button.apply-btn', { timeout: 10000 });
  await page.click('button.apply-btn');
  
  // Login check (user should already be logged in via extension)
  const isLoggedIn = await page.$('.user-logged-in');
  if (!isLoggedIn) {
    throw new Error('Not logged in to Naukri. Please connect your account.');
  }
  
  // Upload resume
  const fileInput = await page.$('input[type="file"]');
  if (fileInput) {
    await fileInput.setInputFiles(resume.file_url);
  }
  
  // Submit
  const submitButton = await page.$('button.send-application');
  if (submitButton) {
    await submitButton.click();
  }
}
