# E2E Testi za MeetupNow aplikacijo

Ta mapa vsebuje end-to-end teste za MeetupNow aplikacijo, napisane s Playwright frameworkom.

## Struktura testov

- `home.spec.ts` - Testi za domačo stran
- `auth.spec.ts` - Testi za avtentikacijo (prijava, registracija, odjava)
- `events.spec.ts` - Testi za prikaz in filtriranje dogodkov
- `create-event.spec.ts` - Testi za ustvarjanje novih dogodkov
- `manage-events.spec.ts` - Testi za urejanje in brisanje dogodkov
- `admin-navigation.spec.ts` - Testi za admin funkcionalnosti in splošno navigacijo
- `test-utils.ts` - Pomožne funkcije za teste
- `global-setup.ts` - Global setup pred vsemi testi
- `global-teardown.ts` - Global cleanup po vseh testih

## Kako zagnati teste

### Vsi testi
```bash
# Priporočeno: zaženi z enim workerjem da se izogneš paralelnih težav
npx playwright test --workers=1

# Ali pa z več workerji (lahko povzroči težave pri paralelnem izvajanju)
npx playwright test
```

### Posamezni test
```bash
npx playwright test auth.spec.ts
```

### Testi z vizualnim vmesnikom
```bash
npx playwright test --ui
```

### Testi v specifičnem brskalniku
```bash
npx playwright test --project=chromium
```

### Debug način
```bash
npx playwright test --debug
```

### Testi z poročili
```bash
npx playwright test --reporter=html
# Potem odpri playwright-report/index.html
```

## Konfiguracija

Testi so konfigurirani v `playwright.config.ts`:

- **Timeout**: 60 sekund na test
- **Brskalnik**: Chromium (lahko dodaš Firefox, WebKit)
- **Video**: Snemanje samo ob napakah
- **Screenshots**: Samo ob napakah
- **Dev server**: Samodejno zažene `npm run dev`

## Testni podatki

Testi uporabljajo naslednje testne podatke:

- **Testni uporabnik**: `admin@gmail.com` / `admin123`
- **Admin uporabnik**: `admin@gmail.com` / `admin123`

**Pomembno**: Pred poganjanjem testov poskrbi, da so ti uporabniki ustvarjeni v bazi ali prilagodi podatke v `test-utils.ts`.

## Pisanje novih testov

### Osnovna struktura testa
```typescript
import { test, expect } from '@playwright/test';
import { loginAsUser } from './test-utils';

test('opis testa', async ({ page }) => {
  // Prijava
  await loginAsUser(page);

  // Akcije
  await page.goto('/nekaj');
  await page.click('button');

  // Preverjanja
  await expect(page.getByText('uspeh')).toBeVisible();
});
```

### Uporaba pomožnih funkcij
```typescript
import { loginAsUser, createTestEvent, deleteAllTestEvents } from './test-utils';

// V testu
await loginAsUser(page);
await createTestEvent(page, { naslov: 'Moj test' });
await deleteAllTestEvents(page);
```

## Odpravljanje težav

### Testi se ne zaženejo
- Preveri, če je dev server že zagnan na portu 3000
- Poskusi `npx playwright install` za namestitev brskalnikov

### Testi padajo zaradi timeout-a
- Povečaj timeout v `playwright.config.ts`
- Dodaj `await page.waitForTimeout(1000)` za počasnejše operacije

### Elementi niso najdeni
- Uporabi `await page.pause()` za debug
- Preveri selektorje s Playwright Codegen: `npx playwright codegen`

### API klici ne delujejo
- Preveri, če so okoljske spremenljivke nastavljene
- Poskusi z mock podatki namesto resničnih API klicev

## Najboljše prakse

1. **Uporabljaj opisna imena testov** - jasno povedo kaj testirajo
2. **Izoliraj teste** - vsak test naj dela neodvisno
3. **Uporabljaj pomožne funkcije** - za ponavljajoče se akcije
4. **Testiraj happy path in edge case-e** - uspešne in napake scenarije
5. **Čisti po testih** - odstrani testne podatke
6. **Uporabljaj ustrezne wait-e** - ne uporabljaj `waitForTimeout` nepotrebno

## CI/CD integracija

Za integracijo v CI/CD sistem dodaš:

```yaml
# GitHub Actions primer
- name: Run E2E tests
  run: npx playwright test
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```