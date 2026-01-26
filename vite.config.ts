import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',

    // ✅ testiraj samo component teste
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],

    // 🚫 IGNORIRAJ E2E teste
    exclude: ['e2e/**', 'node_modules/**'],
    setupFiles: 'src/utils/setupTests.ts',
  },
});
