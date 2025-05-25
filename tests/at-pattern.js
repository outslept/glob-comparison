const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'foo.js'), '');
fs.writeFileSync(path.join(testDir, 'bar.js'), '');
fs.writeFileSync(path.join(testDir, 'baz.js'), '');
fs.writeFileSync(path.join(testDir, 'foobar.js'), '');
fs.writeFileSync(path.join(testDir, 'test.spec.js'), '');
fs.writeFileSync(path.join(testDir, 'test.test.js'), '');
fs.writeFileSync(path.join(testDir, 'app.unit.js'), '');

process.chdir(testDir);

async function testAtPattern() {
  const libraries = [
    { name: 'fast-glob', pkg: 'fast-glob' },
    { name: 'glob', pkg: 'glob' },
    { name: 'globby', pkg: 'globby' },
    { name: 'tiny-glob', pkg: 'tiny-glob' },
    { name: 'tinyglobby', pkg: 'tinyglobby' }
  ];

  for (const lib of libraries) {
    console.log(`\n${lib.name}:`);

    try {
      const module = require(lib.pkg);

      const exactMatch = await getFiles(lib.name, module, '@(foo|bar).js');
      console.log(`  @(foo|bar).js: ${exactMatch.length} files (${exactMatch.join(', ')})`);

      const testTypes = await getFiles(lib.name, module, 'test.@(spec|test).js');
      console.log(`  test.@(spec|test).js: ${testTypes.length} files (${testTypes.join(', ')})`);

      const singleMatch = await getFiles(lib.name, module, '@(foo|baz|app).js');
      console.log(`  @(foo|baz|app).js: ${singleMatch.length} files (${singleMatch.join(', ')})`);

    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

async function getFiles(libName, module, pattern) {
  switch (libName) {
    case 'fast-glob':
      return await module(pattern);
    case 'glob':
      return await module.glob(pattern);
    case 'globby':
      return await module.globby(pattern);
    case 'tiny-glob':
      return await module(pattern);
    case 'tinyglobby':
      return await module.glob(pattern);
  }
}

testAtPattern().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
