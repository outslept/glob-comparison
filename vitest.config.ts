import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ['index.test.ts'],
          name: 'globs',
          environment: 'node',
        },
      },
    ],
  },
});
