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
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [
        'src/services/**/*.ts',
        'src/utils/**/*.ts',
        'src/models/**/*.ts',
        'src/enums/**/*.ts',
        'src/store/**/*.ts',
        'src/pages/**/*.ts',
        'src/pages/**/*.tsx',
        'src/components/**/*.ts',
        'src/components/**/*.tsx',
      ],
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/AudioService.ts',
        '**/InputService.ts',
        '**/RenderService.ts',
        '**/spriteAtlas.ts',
        '**/test/**',
        '**/index.ts',
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
