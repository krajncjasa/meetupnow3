import { test, expect } from '@playwright/test';

test('uporabnik vidi naslov strani', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Meetup')).toBeVisible();
});
