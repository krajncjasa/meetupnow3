import { test, expect } from '@playwright/test';
import { loginAsUser } from './test-utils';

test.describe('SideNav navigacija', () => {
  test.beforeEach(async ({ page }) => {
    // Prijavi se pred vsakim testom
    await page.goto('/prijava');
    await page.waitForSelector('form');
    await page.fill('input[name="email"]', 'admin@gmail.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(dogodki|admin|$)/);
  });

  test('prikaz SideNav elementov', async ({ page }) => {
    // Preveri, če se SideNav pravilno prikaže
    await expect(page.getByText('📅 MeetupNow')).toBeVisible();
    await expect(page.getByText('Navigacija')).toBeVisible();

    // Preveri, če so vsi navigacijski elementi prisotni
    await expect(page.getByText('📋 Izpis dogodkov')).toBeVisible();
    await expect(page.getByText('🎫 Moji prijavljeni dogodki')).toBeVisible();
    await expect(page.getByText('✏️ Spreminjanje dogodkov')).toBeVisible();
    await expect(page.getByText('➕ Ustvari dogodek')).toBeVisible();
    await expect(page.getByText('👑 Admin panel')).toBeVisible();
    await expect(page.getByText('🚪 Odjava')).toBeVisible();
  });

  test('navigacija do izpisa dogodkov', async ({ page }) => {
    // Klikni na "Izpis dogodkov"
    await page.click('text=📋 Izpis dogodkov');

    // Preveri, če se odpre pravilna stran
    await expect(page).toHaveURL('/dogodki');
    await expect(page.getByText('Izpis dogodkov')).toBeVisible();

    // Preveri, če je povezava označena kot aktivna
    const activeLink = page.locator('.bg-indigo-200.text-indigo-900');
    await expect(activeLink).toContainText('📋 Izpis dogodkov');
  });

  test('navigacija do mojih prijavljenih dogodkov', async ({ page }) => {
    // Klikni na "Moji prijavljeni dogodki"
    await page.click('text=🎫 Moji prijavljeni dogodki');

    // Preveri, če se odpre pravilna stran
    await page.waitForURL('/moji_prijavljeni_dogodki');
    await expect(page).toHaveURL('/moji_prijavljeni_dogodki');

    // Preveri, če je povezava označena kot aktivna
    const activeLink = page.locator('.bg-indigo-200.text-indigo-900');
    await expect(activeLink).toContainText('🎫 Moji prijavljeni dogodki');
  });

  test('navigacija do spreminjanja dogodkov', async ({ page }) => {
    // Klikni na "Spreminjanje dogodkov"
    await page.click('text=✏️ Spreminjanje dogodkov');

    // Preveri, če se odpre pravilna stran
    await page.waitForURL('/spreminjanje_dogodkov');
    await expect(page).toHaveURL('/spreminjanje_dogodkov');

    // Preveri, če je povezava označena kot aktivna
    const activeLink = page.locator('.bg-indigo-200.text-indigo-900');
    await expect(activeLink).toContainText('✏️ Spreminjanje dogodkov');
  });

  test('navigacija do ustvarjanja dogodka', async ({ page }) => {
    // Klikni na "Ustvari dogodek"
    await page.click('text=➕ Ustvari dogodek');

    // Preveri, če se odpre pravilna stran
    await expect(page).toHaveURL('/ustvari_dogodek');
    await expect(page.getByText('Ustvari nov dogodek')).toBeVisible();

    // Preveri, če je povezava označena kot aktivna
    const activeLink = page.locator('.bg-indigo-200.text-indigo-900');
    await expect(activeLink).toContainText('➕ Ustvari dogodek');
  });

  test('navigacija do admin panela', async ({ page }) => {
    // Klikni na "Admin panel"
    await page.click('text=👑 Admin panel');

    // Preveri, če se odpre pravilna stran
    await page.waitForURL('/admin');
    await expect(page).toHaveURL('/admin');

    // Preveri, če je povezava označena kot aktivna (admin ima drugačno barvo)
    const activeLink = page.locator('.bg-purple-200.text-purple-900');
    await expect(activeLink).toContainText('👑 Admin panel');
  });

  test('odjava preko SideNav', async ({ page }) => {
    // Klikni na gumb "Odjava"
    await page.click('text=🚪 Odjava');

    // Preveri, če se preusmeri na prijavno stran
    await page.waitForURL('/prijava');
    await expect(page).toHaveURL('/prijava');

    // Preveri, če je uporabnik odjavljen (localStorage cleared)
    // To je težko testirati direktno, ampak vsaj preveri, če smo na login strani
    await expect(page.getByRole('heading', { name: 'Prijava' })).toBeVisible();
  });

  test('aktivni linki se pravilno označujejo', async ({ page }) => {
    // Začni na dogodkih
    await page.goto('/dogodki');
    await expect(page.locator('.bg-indigo-200.text-indigo-900')).toContainText('📋 Izpis dogodkov');

    // Pojdi na admin
    await page.click('text=👑 Admin panel');
    await page.waitForURL('/admin');
    await expect(page.locator('.bg-purple-200.text-purple-900')).toContainText('👑 Admin panel');

    // Pojdi na ustvari dogodek
    await page.click('text=➕ Ustvari dogodek');
    await expect(page).toHaveURL('/ustvari_dogodek');
    await expect(page.locator('.bg-indigo-200.text-indigo-900')).toContainText('➕ Ustvari dogodek');
  });
});