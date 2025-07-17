// test/brace-expansion.ts
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
  'app.js', 'app.ts', 'app.jsx', 'app.tsx', 'app.css',
  'config.js', 'config.json', 'config.yaml', 'config.yml',
  'test.spec.js', 'test.test.js', 'main.spec.js', 'main.test.js',
  'file1.txt', 'file2.txt', 'file3.txt', 'file4.txt', 'file5.txt',
  'file01.txt', 'file02.txt', 'file03.txt', 'file04.txt', 'file05.txt',
  'component.vue', 'component.jsx', 'component.tsx',
  'style.css', 'style.scss', 'style.sass',
  'data.json', 'data.xml', 'data.yaml',
  'foo.js', 'bar.js', 'baz.js',
];

const PATTERNS = [
  // Basic expansion
  'app.{js,ts}',
  'config.{js,json}',
  '*.{js,ts,css}',

  // Nested expansion
  '*.{spec,test}.js',
  'app.{js,ts,jsx}',
  'style.{css,scss}',

  // Multiple expansion
  '{app,config}.{js,json}',
  '{test,main}.{spec,test}.js',
  '{style,app}.{css,js}',

  // Numeric ranges
  'file{1..3}.txt',
  'file{1..5}.txt',
  'file{2..4}.txt',

  // Zero-padded ranges
  'file{01..03}.txt',
  'file{01..05}.txt',
  'file{02..04}.txt',

  // Single item braces
  'app.{js}',
  'config.{json}',
  'style.{css}',

  // Complex combinations
  '{foo,bar,baz}.js',
  'data.{json,xml,yaml}',
  'component.{vue,jsx,tsx}',
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
