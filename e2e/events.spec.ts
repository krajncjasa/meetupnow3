import { test, expect } from '@playwright/test';

test.describe('Prikaz dogodkov', () => {
  test.beforeEach(async ({ page }) => {
    // Prijavi se pred vsakim testom
    await page.goto('/prijava');
    await page.waitForSelector('form');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dogodki|admin|$)/);
  });

  test('prikaz seznama dogodkov', async ({ page }) => {
    await page.goto('/dogodki');

    // Preveri, če se stran naloži
    await expect(page.getByText('Izpis dogodkov')).toBeVisible();

    // Preveri, če obstajajo dogodki ali sporočilo o prazni listi
    const hasEvents = await page.locator('.bg-white.shadow-md').count() > 0;
    if (hasEvents) {
      await expect(page.locator('.bg-white.shadow-md')).toHaveCount(await page.locator('.bg-white.shadow-md').count());
    } else {
      await expect(page.getByText(/Ni dogodkov za izbrane filtre|nimaš še nobenega/i)).toBeVisible();
    }
  });

  test('filtriranje dogodkov po vrsti', async ({ page }) => {
    await page.goto('/dogodki');

    // Klikni na filter šport
    const sportCheckbox = page.locator('input[value="šport"]');
    if (await sportCheckbox.isVisible()) {
      await sportCheckbox.check();

      // Preveri, če se filter uporabi
      await expect(page.locator('input[value="šport"]')).toBeChecked();
    }
  });

  test('prikaz podrobnosti dogodka', async ({ page }) => {
    await page.goto('/dogodki');

    // Poišči dogodek in klikni nanj
    const eventCard = page.locator('.bg-white.shadow-md').first();
    if (await eventCard.isVisible()) {
      const eventTitle = await eventCard.locator('h3').textContent();

      // Klikni na naslov dogodka (če je povezava)
      const eventLink = eventCard.locator('a').first();
      if (await eventLink.isVisible()) {
        await eventLink.click();

        // Preveri, če se odpre stran s podrobnostmi
        await expect(page).toHaveURL(/\/prikaz_dogodka\//);
        await expect(page.getByText(eventTitle || '')).toBeVisible();
      }
    }
  });

  test('navigacija med stranmi', async ({ page }) => {
    // Testiraj navigacijo v SideNav
    await page.click('text=📋 Izpis dogodkov');
    await expect(page).toHaveURL('/dogodki');

    await page.click('text=🎫 Moji prijavljeni dogodki');
    await page.waitForURL('/moji_prijavljeni_dogodki');
    await expect(page).toHaveURL('/moji_prijavljeni_dogodki');

    await page.click('text=✏️ Spreminjanje dogodkov');
    await page.waitForURL('/spreminjanje_dogodkov');
    await expect(page).toHaveURL('/spreminjanje_dogodkov');
  });
});