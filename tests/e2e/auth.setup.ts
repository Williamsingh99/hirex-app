import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

test('authenticate and save session', async ({ page }) => {
  const email = process.env.E2E_TEST_USER_EMAIL!;
  const password = process.env.E2E_TEST_USER_PASSWORD!;

  // 1. Use the hidden E2E login route to establish a session
  // Because this is a route handler using createClient() from @/lib/supabase/server,
  // it will set the correct SSR cookies in the response.
  const response = await page.request.post('/api/auth/e2e-login', {
    data: {
      email,
      password,
    },
  });

  expect(response.ok()).toBeTruthy();

  // 2. The response cookies are now automatically stored in the browser context
  // We just need to verify the session is active by hitting a protected page or API
  const dashResponse = await page.request.get('/dashboard');
  // Note: If the server returns 200, the cookies were correctly set.
  expect(dashResponse.status()).toBe(200);

  // 3. Save the complete browser state (cookies + storage) to the file
  await page.context().storageState({ path: 'storageState.json' });
});
