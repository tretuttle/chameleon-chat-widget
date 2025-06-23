import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    reporters: ['verbose'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.spec.ts'],
    testTimeout: 60000, // 60 seconds per test
    hookTimeout: 30000, // 30 seconds for hooks
    teardownTimeout: 10000, // 10 seconds for teardown
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})