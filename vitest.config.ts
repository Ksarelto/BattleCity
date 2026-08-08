import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/game/**/*.ts', 'src/store/**/*.ts', 'src/app/playtestLevel.ts'],
      exclude: [
        '**/*.test.ts',
        '**/gameEngine.ts',
        '**/audioManager.ts',
        '**/inputManager.ts',
      ],
      thresholds: {
        lines: 55,
        functions: 55,
        branches: 45,
        statements: 55,
      },
    },
  },
});
