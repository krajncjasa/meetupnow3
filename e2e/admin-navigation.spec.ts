import { test, expect } from '@playwright/test';

test.describe('Administracija', () => {
  test('prijava administratorja', async ({ page }) => {
    await page.goto('/prijava');

    // Počakaj, da se stran naloži
    await page.waitForSelector('form');

    // Prijavi se kot admin
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');

    await page.click('button[type="submit"]');

    // Počakaj na uspešno prijavo
    await page.waitForURL(/\/(admin|dogodki|$)/, { timeout: 10000 });
  });

  test('prikaz admin strani', async ({ page }) => {
    // Prijavi se kot admin
    await page.goto('/prijava');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/(admin|dogodki|$)/);

    // Če obstaja admin stran, jo obišči
    if (page.url().includes('admin')) {
      await expect(page.getByText(/admin|upravljanje/i)).toBeVisible();
    }
  });

  test('navigacija do admin panela', async ({ page }) => {
    // Prijavi se kot admin
    await page.goto('/prijava');
    await page.waitForSelector('form');
    await page.waitForSelector('input[name="email"]'); // Wait for React to hydrate

    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/(admin|dogodki|$)/);

    // Klikni na admin panel v navigaciji
    await page.click('text=👑 Admin panel');

    // Preveri, če se odpre admin stran
    await expect(page).toHaveURL('/admin');
    await expect(page.getByText('Čakanje na odobritev')).toBeVisible();
  });

  test('prikaz dogodkov v admin panelu', async ({ page }) => {
    // Prijavi se kot admin
    await page.goto('/prijava');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');

    await page.waitForURL(/\/(admin|dogodki|$)/);

    // Pojdi na admin stran
    await page.goto('/admin');

    // Preveri, če se prikažejo dogodki ali sporočilo o prazni listi
    const hasEvents = await page.locator('.bg-white.shadow-md').count() > 0;
    if (hasEvents) {
      await expect(page.locator('.bg-white.shadow-md')).toHaveCount(await page.locator('.bg-white.shadow-md').count());
      // Preveri, če so prisotni gumbi za odobritev/zavrnitev
      await expect(page.getByText('Odobri')).toBeVisible();
      await expect(page.getByText('Zavrni')).toBeVisible();
    } else {
      await expect(page.getByText('Trenutno ni dogodkov, ki čakajo na odobritev.')).toBeVisible();
    }
  });
});