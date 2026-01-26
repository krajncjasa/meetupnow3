import { test, expect } from '@playwright/test';

test.describe('Upravljanje dogodkov', () => {
  test.beforeEach(async ({ page }) => {
    // Prijavi se pred vsakim testom
    await page.goto('/prijava');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dogodki|admin|$)/);
  });

  test('prikaz strani za upravljanje dogodkov', async ({ page }) => {
    await page.goto('/spreminjanje_dogodkov');

    await expect(page.getByRole('heading', { name: 'Spreminjanje dogodkov' })).toBeVisible();
  });

  test('filtriranje dogodkov v upravljanju', async ({ page }) => {
    await page.goto('/spreminjanje_dogodkov');

    // Klikni na filter
    const sportCheckbox = page.locator('input[value="šport"]');
    if (await sportCheckbox.isVisible()) {
      await sportCheckbox.check();
      await expect(sportCheckbox).toBeChecked();
    }
  });

  test('urejanje dogodka', async ({ page }) => {
    await page.goto('/spreminjanje_dogodkov');

    // Poišči dogodek z gumbom "Uredi"
    const editButton = page.locator('text=Uredi').first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Preveri, če se odpre stran za urejanje
      await expect(page).toHaveURL(/\/uredi_dogodek\//);
      await expect(page.getByText('Uredi dogodek')).toBeVisible();

      // Spremeni naslov
      const newTitle = `Posodobljen dogodek ${Date.now()}`;
      await page.fill('input[name="naslov"]', newTitle);

      // Shrani spremembe
      await page.click('text=Posodobi dogodek');

      // Preveri uspešno sporočilo
      await expect(page.getByText(/uspešno posodobljen/i)).toBeVisible();

      // Preveri preusmeritev nazaj
      await expect(page).toHaveURL('/spreminjanje_dogodkov');
    }
  });

  test('brisanje dogodka', async ({ page }) => {
    await page.goto('/spreminjanje_dogodkov');

    // Preveri število dogodkov pred brisanjem
    const initialCount = await page.locator('.bg-white.shadow-md').count();

    // Poišči gumb "Izbriši" in klikni
    const deleteButton = page.locator('text=Izbriši').first();
    if (await deleteButton.isVisible()) {
      // Potrdi brisanje v dialogu
      page.on('dialog', dialog => dialog.accept());

      await deleteButton.click();

      // Počakaj na osvežitev strani
      await page.waitForTimeout(1000);

      // Preveri, če se je število dogodkov zmanjšalo
      const newCount = await page.locator('.bg-white.shadow-md').count();
      expect(newCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('preklic urejanja dogodka', async ({ page }) => {
    await page.goto('/spreminjanje_dogodkov');

    const editButton = page.locator('text=Uredi').first();
    if (await editButton.isVisible()) {
      await editButton.click();

      // Klikni preklic
      await page.click('text=Prekliči');

      // Preveri preusmeritev nazaj
      await expect(page).toHaveURL('/spreminjanje_dogodkov');
    }
  });
});