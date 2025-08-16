import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    resolveSnapshotPath: (testPath, snapExtension) => {
      const platform = process.platform === 'win32' ? 'win32' : 'linux';
      const dir = path.dirname(testPath);
      const filename = path.basename(testPath, path.extname(testPath));
      return path.join(dir, '__snapshots__', `${filename}.${platform}${snapExtension}`);
    },
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
