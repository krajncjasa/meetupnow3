import { Page } from '@playwright/test';

/**
 * Pomožne funkcije za e2e teste
 */

export async function loginAsUser(page: Page, email = 'admin@gmail.com', password = 'admin123') {
  await page.goto('/prijava');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dogodki|admin|$)/);
}

export async function loginAsAdmin(page: Page, email = 'admin@example.com', password = 'admin123') {
  await page.goto('/prijava');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(admin|dogodki|$)/);
}

export async function logout(page: Page) {
  await page.click('text=🚪 Odjava');
  await page.waitForURL('/prijava');
}

export async function createTestEvent(page: Page, eventData?: {
  naslov?: string;
  kraj?: string;
  opis?: string;
  vrsta?: string[];
  cas_dogodka?: string;
}) {
  await page.goto('/ustvari_dogodek');

  const defaultData = {
    naslov: `Test Dogodek ${Date.now()}`,
    kraj: 'Ljubljana',
    opis: 'Opis testnega dogodka za avtomatizirane teste',
    vrsta: ['šport'],
    cas_dogodka: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().slice(0, 16);
    })()
  };

  const data = { ...defaultData, ...eventData };

  await page.fill('input[name="naslov"]', data.naslov);
  await page.fill('textarea[name="opis"]', data.opis);
  await page.fill('input[name="kraj"]', data.kraj);

  // Odkljukaj vse vrste in izberi željene
  for (const vrsta of ['šport', 'kultura', 'druženje', 'zabava']) {
    await page.uncheck(`input[value="${vrsta}"]`);
  }
  for (const vrsta of data.vrsta) {
    await page.check(`input[value="${vrsta}"]`);
  }

  await page.fill('input[name="cas_dogodka"]', data.cas_dogodka);

  // Naloži testno sliko
  await page.setInputFiles('input[name="slika"]', {
    name: 'test-image.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
  });

  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000); // Počakaj na obdelavo
}

export async function deleteAllTestEvents(page: Page) {
  await page.goto('/spreminjanje_dogodkov');

  // Poišči in izbriši vse testne dogodke
  const testEvents = page.locator('.bg-white.shadow-md').filter({ hasText: 'Test Dogodek' });

  const count = await testEvents.count();
  for (let i = 0; i < count; i++) {
    const deleteButton = testEvents.nth(i).locator('text=Izbriši');
    if (await deleteButton.isVisible()) {
      page.on('dialog', dialog => dialog.accept());
      await deleteButton.click();
      await page.waitForTimeout(500);
    }
  }
}

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}