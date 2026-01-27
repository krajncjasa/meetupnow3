import { test, expect } from '@playwright/test';

test.describe('Avtentikacija', () => {

  test('uspešna prijava', async ({ page }) => {
    // Odpri login stran
    await page.goto('/prijava');

    // Počakaj, da se input polja naložijo
    await page.waitForSelector('input[name="email"]');
    await page.waitForSelector('input[name="password"]');

    // Vnesi email in geslo (uporabniški test account)
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');

    // Klikni na gumb za prijavo
    await page.click('button:has-text("Prijavi se")');

    // Počakaj, da se URL spremeni na dashboard ali dogodek
    await page.waitForURL(/\/(dashboard|dogodki|admin)/);

    // Preveri, da je gumb odjava viden
    const odjava = page.getByText('Odjava');
    await odjava.waitFor({ state: 'visible' });
    await expect(odjava).toBeVisible();


    });
  test('neuspešna prijava z napačnimi podatki', async ({ page }) => {
    // Odpri login stran
    await page.goto('/prijava');

    // Počakaj, da se input polja naložijo
    await page.waitForSelector('input[name="email"]');
    await page.waitForSelector('input[name="password"]');

    // Vnesi napačen email in geslo
    await page.fill('input[name="email"]', 'napacen@email.com');
    await page.fill('input[name="password"]', 'napacno_geslo');

    // Klikni na gumb za prijavo
    await page.click('button:has-text("Prijavi se")');

    // Preveri, da ostaneš na login strani
    await expect(page).toHaveURL('/prijava');

    // Preveri, da se prikaže sporočilo o napaki
    await expect(page.getByText(/napaka|napačno|napaka pri prijavi|uporabnik ne obstaja/i)).toBeVisible();
  });
  test('uspešna registracija novega uporabnika', async ({ page }) => {
    // Odpri registracijsko stran
    await page.goto('/registracija');

    // Počakaj, da se input polja naložijo
    await page.waitForSelector('input[name="name"]');
    await page.waitForSelector('input[name="email"]');
    await page.waitForSelector('input[name="password"]');
    await page.waitForSelector('input[name="confirmPassword"]');

    // Uporabi unikaten email za test
    const randomEmail = `user${Date.now()}@example.com`;

    // Vnesi podatke
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', 'geslo123');
    await page.fill('input[name="confirmPassword"]', 'geslo123');

    // Klikni na gumb Registriraj se
    await page.click('button:has-text("Registriraj se")');

    // Počakaj, da se pojavi sporočilo o uspehu
    const successMessage = page.getByText('Registracija uspešna!');
    await successMessage.waitFor({ state: 'visible' });
    await expect(successMessage).toBeVisible();

    // Počakaj redirect na /prijava
    await page.waitForURL('/prijava');
    await expect(page).toHaveURL('/prijava');
  });

});
