import { mkdir, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import { styleText } from 'node:util';
import { glob } from 'glob';
import fastGlob from 'fast-glob';
import { globby } from 'globby';
import tinyGlob from 'tiny-glob';
import { glob as tinyglobby } from 'tinyglobby';
import { globSync as nodeGlobSync } from 'node:fs';
import normalizePath from '../internal/normalize-path.js';

const FIXTURE_DIR = 'test-fixtures';

const FILES = [
  'file.js',
  'src/index.js',
  'src/main.js',
  'src/components/Button.js',
  'src/components/Input.js',
  'src/utils/helper.js',
  'src/utils/math/calc.js',
  'src/utils/string/format.js',
  'lib/core.js',
  'lib/plugins/auth.js',
  'lib/plugins/cache/redis.js',
  'tests/unit/app.test.js',
  'tests/integration/api.test.js',
  'docs/readme.md',
  'docs/api/endpoints.md',
  'config/dev.json',
  'config/prod.json',
  'dist/bundle.js',
  'dist/assets/style.css',
  'node_modules/package/index.js',
];

const PATTERNS = [
  // Basic globstar
  '**',
  '**/*',
  '**/*.js',

  // Nested globstar
  'src/**/*.js',
  'lib/**/*.js',
  'tests/**/*.js',

  // Mixed globstar
  '**/components/*.js',
  '**/plugins/**/*.js',
  '**/utils/*.js',

  // Globstar with specific paths
  'src/**/Button.js',
  'lib/**/auth.js',
  'config/**/*.json',

  // Multiple globstar
  'src/**/**/calc.js',
  'lib/**/**/redis.js',

  // Globstar at different positions
  '**/src/*.js',
  'src/**',
  '**/*.md',

  // Complex combinations
  '{src,lib}/**/*.js',
  '**/test*/**/*.js',
  '**/{components,utils}/*.js',
];

const LIBS: Record<string, (pattern: string) => Promise<string[]>> = {
  glob: (pattern: string) => glob(pattern),
  'fast-glob': (pattern: string) => fastGlob(pattern),
  globby: (pattern: string) => globby(pattern),
  'tiny-glob': (pattern: string) => tinyGlob(pattern),
  tinyglobby: (pattern: string) => tinyglobby(pattern),
  'node:fs': (pattern: string) => Promise.resolve(nodeGlobSync(pattern)),
};

async function setupFixtures(): Promise<void> {
  await rm(FIXTURE_DIR, { recursive: true, force: true });

  for (const file of FILES) {
    const fullPath = join(FIXTURE_DIR, file);
    await mkdir(join(fullPath, '..'), { recursive: true });
    await writeFile(fullPath, '');
  }
}

async function runTests(): Promise<void> {
  await setupFixtures();

  try {
    for (const pattern of PATTERNS) {
      console.log(styleText('bold', `"${pattern}"`));

      for (const [libName, libFunc] of Object.entries(LIBS)) {
        try {
          const results = await libFunc(`${FIXTURE_DIR}/${pattern}`);
          console.log(`  ${libName} (${results.length}): ${styleText('gray', results.map(path => normalizePath(path)).sort().join(', '))}`);
        } catch (error) {
          console.log(`  ${styleText('gray', libName)} (ERROR): ${String(error)}`);
        }
      }
      console.log('');
    }
  } finally {
    await rm(FIXTURE_DIR, { recursive: true, force: true });
  }
}

runTests().catch(console.error);
