import { chromium } from '@playwright/test';

/**
 * Global teardown - se izvede po vseh testih
 * Tukaj počistiš teste podatke in okolje
 */
async function globalTeardown() {
  console.log('🧹 Čiščenje po e2e testih...');

  // Lahko dodaš čiščenje testnih podatkov
  // Na primer: brisanje testnih uporabnikov, čiščenje baze, itd.

  console.log('✅ Global teardown zaključen');
}

export default globalTeardown;