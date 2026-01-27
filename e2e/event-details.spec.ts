import { test, expect } from '@playwright/test';
import { loginAsUser } from './test-utils';

test.describe('Prikaz podrobnosti dogodka', () => {
  test.beforeEach(async ({ page }) => {
    // Prijavi se pred vsakim testom
    await page.goto('/prijava');
    await page.waitForSelector('form');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dogodki|admin|$)/);
  });

  test('napaka če dogodek ne obstaja', async ({ page }) => {
    // Pojdi na neobstoječi dogodek
    await page.goto('/prikaz_dogodka/99999');

    // Preveri, če se prikaže sporočilo o napaki
    await expect(page.getByText('Dogodek ni najden.')).toBeVisible();
  });

  test('prikaz loading stanja', async ({ page }) => {
    // Pojdi na neobstoječi dogodek da vidimo loading
    await page.goto('/prikaz_dogodka/1');

    // Preveri, če se prikaže loading sporočilo
    await expect(page.getByText('Nalaganje...')).toBeVisible();
  });
});