import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    reporters: ['default', 'json'],
    typecheck: {
      tsconfig: './tsconfig.test.json'
    },
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['src/**/*.spec.ts', 'node_modules', 'dist', 'dist-widget'],
    testTimeout: 120000 // 2 minutes for comprehensive integration tests
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
