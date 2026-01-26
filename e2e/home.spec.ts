import { test, expect } from '@playwright/test';

test.describe('Domača stran', () => {
  test('uporabnik vidi naslov strani in navigacijo', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Prijava')).toBeVisible();
    await expect(page.getByText('Registracija')).toBeVisible();
  });

  test('stran se pravilno naloži', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Meetup/);
  });
});
