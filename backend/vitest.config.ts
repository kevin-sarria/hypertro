import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      JWT_ACCESS_SECRET: 'test_access_secret_0123456789abcdef0123',
      JWT_REFRESH_SECRET: 'test_refresh_secret_0123456789abcdef012'
    },
    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});
