import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createFixture } from 'fs-fixture';
import { Glob, glob as npmGlob } from 'glob';
import fastGlob from 'fast-glob';
import { globby } from 'globby';
import tinyGlob from 'tiny-glob';
import { glob as tinyglobby } from 'tinyglobby';
import { glob as nodeGlob, symlink } from 'node:fs/promises';
import path from 'node:path';

const FIXTURE_STRUCTURE = {
  'abc': '', 'abd': '', 'bb': '', 'ca': '', 'dd': '',
  'foo.js': '', 'bar.js': '', 'FOO.JS': '',
  'app.js': '', 'app.ts': '', 'app.jsx': '', 'app.css': '',
  'app.min.js': '', 'app.dev.js': '', 'app.prod.js': '',
  'config.js': '', 'config.json': '', 'config.yaml': '',
  'test.js': '', 'test.spec.js': '', 'test.unit.js': '',
  'main.js': '', 'main.min.js': '', 'main.spec.js': '',
  'a.js': '', 'b.js': '', 'z.js': '', 'c.js': '', 'd.js': '',
  'A.js': '', 'Z.js': '', 'B.js': '', 'C.js': '',
  '1.txt': '', '2.txt': '', '9.txt': '', '3.txt': '', '4.txt': '', '5.txt': '',
  'file01.txt': '', 'file02.txt': '', 'file05.txt': '', 'file03.txt': '', 'file04.txt': '',
  'file.txt': '', 'file1.txt': '', 'file3.txt': '', 'file2.txt': '', 'file5.txt': '',
  'file-a.js': '', 'file-z.js': '', 'file-b.js': '', 'file-d.js': '',
  'test1.js': '', 'test9.js': '', 'test_1.js': '', 'test2.js': '',
  'component.vue': '', 'component.jsx': '', 'component.tsx': '',
  'style.css': '', 'style.scss': '', 'style.min.css': '',
  'data.json': '', 'data.xml': '', 'data.yaml': '',
  'readme.md': '', 'package.json': '', 'changelog.md': '',
  'x.html': '', 'z.html': '', 'y.html': '',
  '.hidden': '', '.config': '',
  'letter-a': '', 'letter-c': '', 'a.b': '', 'z.z': '', 'x.y': '',
  'ab.js': '', 'az.js': '', 'xyz.js': '', 'ac.js': '',
  'foo[bar].js': '',
  'est.js': '', 'aa.js': '', 'aaa.js': '',
  'src': {
    'index.js': '', 'main.js': '',
    'components': { 'Button.js': '', 'Input.js': '' },
    'utils': { 'helper.js': '', 'math': { 'calc.js': '' } }
  },
  'lib': { 'core.js': '', 'plugins': { 'auth.js': '' } },
  'tests': { 'unit': { 'app.test.js': '' }, 'integration': { 'api.test.js': '' } },
  'docs': { 'readme.md': '' },
  'config': { 'dev.json': '', 'prod.json': '' },
  'dist': { 'bundle.js': '' },
  'node_modules': { 'package': { 'index.js': '' } }
};

const isWindows = process.platform === 'win32';

describe(`glob tests (${isWindows ? 'win32' : 'linux'})`, () => {
  let testFixture;

  beforeAll(async () => {
    testFixture = await createFixture(FIXTURE_STRUCTURE);

    await symlink(
      path.join(testFixture.path, 'src'),
      path.join(testFixture.path, 'src-link')
    ).catch(() => { });

    if (!isWindows) {
      await symlink(
        path.join(testFixture.path, 'main.js'),
        path.join(testFixture.path, 'main-link.js')
      ).catch(() => { });
    }
  });

  afterAll(async () => {
    await testFixture.rm();
  });

  it('wildcard *', async () => {
    const pattern = '*';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_wildcard_star`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('*.js files', async () => {
    const pattern = '*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_js_files`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('braces pattern {js,ts}', async () => {
    const pattern = '*.{js,ts}';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_braces_js_ts`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('brace expansion numeric', async () => {
    const pattern = 'file{1..3}.txt';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_brace_numeric`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('brace expansion zero padded', async () => {
    const pattern = 'file{01..05}.txt';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_brace_zero_pad`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('brace expansion alpha', async () => {
    const pattern = '{a..c}.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_brace_alpha`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('character class list', async () => {
    const pattern = '[abc].js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_charclass_list`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('character class range', async () => {
    const pattern = '[a-c].js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_charclass_range`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('character class negated', async () => {
    const pattern = '[!abc].js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_charclass_negate`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('extglob @(js|ts)', async () => {
    const pattern = '*.@(js|ts)';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_extglob_at`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('extglob negation', async () => {
    const pattern = '!(foo|bar).js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_extglob_not`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('globstar recursive', async () => {
    const pattern = '**/*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_globstar_recursive`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('globstar src/**/*.js', async () => {
    const pattern = 'src/**/*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_globstar_src`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('globstar only', async () => {
    const pattern = '**';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_globstar_only`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('directories with trailing slash', async () => {
    const pattern = 'src/**/';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_dirs_trailing_slash`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('first level directories', async () => {
    const pattern = '*/';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_dirs_first_level`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('question mark single char', async () => {
    const pattern = '?.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_qmark_single`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('dotfiles in root', async () => {
    const pattern = '.*';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_dotfiles_root`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('dotfiles recursive', async () => {
    const pattern = '**/.*';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_dotfiles_deep`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('negation with arrays', async () => {
    const patterns = ['**/*.js', '!**/*.{test,spec,unit}.js'];
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_negation_arrays`;

    const npmGlobResults = await npmGlob(patterns, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(patterns, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(patterns, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobFirstPattern = await tinyGlob(patterns[0], {
      // tiny-glob doesn't handle patterns[]. sadge
      cwd: workingDirectory
    });
    expect(tinyGlobFirstPattern).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(patterns, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(patterns, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('dot option enabled', async () => {
    const pattern = '*';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_dot_enabled`;

    const npmGlobResults = await npmGlob(pattern, {
      cwd: workingDirectory,
      dot: true
    });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false,
      dot: true
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false,
      dot: true
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory,
      dot: true
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false,
      dot: true
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, {
      cwd: workingDirectory,
      // no alternative unfortunately
    });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('only files filter', async () => {
    const pattern = '**';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_only_files`;

    const npmGlobResults = await npmGlob(pattern, {
      cwd: workingDirectory,
      nodir: true
    });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: true,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: true,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory,
      filesOnly: true
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: true
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, {
      cwd: workingDirectory
    });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('only directories pattern', async () => {
    const pattern = '**/';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_only_directories`;

    const npmGlobResults = await npmGlob(pattern, {
      cwd: workingDirectory
    });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory,
      filesOnly: false
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, {
      cwd: workingDirectory
    });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('case insensitive matching', async () => {
    const pattern = '*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_case_insensitive`;

    const npmGlobResults = await npmGlob(pattern, {
      cwd: workingDirectory,
      nocase: true
    });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false,
      caseSensitiveMatch: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false,
      caseSensitiveMatch: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory,
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false,
      caseSensitiveMatch: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, {
      cwd: workingDirectory,
      // no alternative unfortunately
    });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('max depth 1', async () => {
    const pattern = '**';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_max_depth_1`;

    const npmGlobResults = await npmGlob(pattern, {
      cwd: workingDirectory,
      maxDepth: 1
    });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false,
      deep: 1
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false,
      deep: 1
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false,
      deep: 1
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, {
      cwd: workingDirectory
    });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('ignore patterns', async () => {
    const pattern = '**/*.js';
    const ignorePatterns = ['**/*.{test,spec}.js', 'tests/**', 'node_modules/**'];
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_ignore_patterns`;

    const npmGlobResults = await npmGlob(pattern, {
      cwd: workingDirectory,
      ignore: ignorePatterns
    });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false,
      ignore: ignorePatterns
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false,
      ignore: ignorePatterns
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false,
      ignore: ignorePatterns
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, {
      cwd: workingDirectory,
      exclude: ignorePatterns
    });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('symlink dir recursive', async () => {
    const pattern = 'src-link/**/*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_symlink_dir`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('files with spaces and special chars', async () => {
    const pattern = 'file*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_special_chars`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('unicode filenames', async () => {
    const pattern = '*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_unicode_files`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('posix alpha character class', async () => {
    const pattern = '[[:alpha:]]*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_posix_alpha`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('posix digit character class', async () => {
    const pattern = '*[[:digit:]].js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_posix_digit`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('escaped asterisk literal', async () => {
    const pattern = '\\*.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_escaped_asterisk`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  it('escaped question mark literal', async () => {
    const pattern = '\\?.js';
    const workingDirectory = testFixture.path;
    const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_escaped_question`;

    const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
    expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

    const fastGlobResults = await fastGlob(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      objectMode: false
    });
    expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

    const globbyResults = await globby(pattern, {
      cwd: workingDirectory,
      onlyFiles: false,
      expandDirectories: false
    });
    expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

    const tinyGlobResults = await tinyGlob(pattern, {
      cwd: workingDirectory
    });
    expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

    const tinyglobbyResults = await tinyglobby(pattern, {
      cwd: workingDirectory,
      expandDirectories: false,
      onlyFiles: false
    });
    expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

    const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
    expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
  });

  if (!isWindows) {
    it('symlink file literal', async () => {
      const pattern = 'main-link.js';
      const workingDirectory = testFixture.path;
      const snapshotPrefix = `${isWindows ? 'win32' : 'linux'}_symlink_file`;

      const npmGlobResults = await npmGlob(pattern, { cwd: workingDirectory });
      expect(npmGlobResults).toMatchSnapshot(`${snapshotPrefix}_npm_glob`);

      const fastGlobResults = await fastGlob(pattern, {
        cwd: workingDirectory,
        onlyFiles: false,
        objectMode: false
      });
      expect(fastGlobResults).toMatchSnapshot(`${snapshotPrefix}_fast_glob`);

      const globbyResults = await globby(pattern, {
        cwd: workingDirectory,
        onlyFiles: false,
        expandDirectories: false
      });
      expect(globbyResults).toMatchSnapshot(`${snapshotPrefix}_globby`);

      const tinyGlobResults = await tinyGlob(pattern, {
        cwd: workingDirectory
      });
      expect(tinyGlobResults).toMatchSnapshot(`${snapshotPrefix}_tiny_glob`);

      const tinyglobbyResults = await tinyglobby(pattern, {
        cwd: workingDirectory,
        expandDirectories: false,
        onlyFiles: false
      });
      expect(tinyglobbyResults).toMatchSnapshot(`${snapshotPrefix}_tinyglobby`);

      const nodeFsResults = nodeGlob(pattern, { cwd: workingDirectory });
      expect(nodeFsResults).toMatchSnapshot(`${snapshotPrefix}_node_fs`);
    });
  }
});
