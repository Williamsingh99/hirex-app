import { test, expect } from '@playwright/test';

test.describe('Dashboard Flow', () => {
  test('should load the dashboard and display the command center', async ({ page }) => {
    // 1. Navigate to the dashboard
    // Since we are using storageState, we should already be authenticated
    await page.goto('/dashboard');

    // 2. Verify we are on the dashboard page
    await expect(page).toHaveURL(/\/dashboard/);

    // 3. Check for the "Command Center" heading
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Command Center');

    // 4. Verify core dashboard components are rendered
    // StatsGrid check (looking for a common text in the grid)
    const stats = page.locator('text=Total Applied');
    await expect(stats).toBeVisible();

    // Application Tracker check
    const tracker = page.locator('text=Application Pipeline');
    await expect(tracker).toBeVisible();
  });

  test('should maintain session on page refresh', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Command Center');

    await page.reload();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Command Center');
  });
});
