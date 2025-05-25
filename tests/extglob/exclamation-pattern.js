const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'foo.js'), '');
fs.writeFileSync(path.join(testDir, 'bar.js'), '');
fs.writeFileSync(path.join(testDir, 'baz.js'), '');
fs.writeFileSync(path.join(testDir, 'test.js'), '');
fs.writeFileSync(path.join(testDir, 'app.min.js'), '');
fs.writeFileSync(path.join(testDir, 'app.dev.js'), '');
fs.writeFileSync(path.join(testDir, 'config.js'), '');

process.chdir(testDir);

async function testExclamationPattern() {
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

      const notFooBar = await getFiles(lib.name, module, '!(foo|bar).js');
      console.log(`  !(foo|bar).js: ${notFooBar.length} files (${notFooBar.join(', ')})`);

      const notMin = await getFiles(lib.name, module, 'app.!(min).js');
      console.log(`  app.!(min).js: ${notMin.length} files (${notMin.join(', ')})`);

      const notTest = await getFiles(lib.name, module, '!(test|config).js');
      console.log(`  !(test|config).js: ${notTest.length} files (${notTest.join(', ')})`);

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

testExclamationPattern().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
