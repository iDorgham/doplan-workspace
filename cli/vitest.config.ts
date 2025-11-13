import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    // Ensure consistent snapshot comparison in CI
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: false,
    },
  },
});

