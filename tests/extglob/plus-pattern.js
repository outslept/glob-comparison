const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'foo.js'), '');
fs.writeFileSync(path.join(testDir, 'bar.js'), '');
fs.writeFileSync(path.join(testDir, 'foobar.js'), '');
fs.writeFileSync(path.join(testDir, 'foofoo.js'), '');
fs.writeFileSync(path.join(testDir, 'baz.js'), '');
fs.writeFileSync(path.join(testDir, 'test1.txt'), '');
fs.writeFileSync(path.join(testDir, 'test11.txt'), '');
fs.writeFileSync(path.join(testDir, 'test2.txt'), '');

process.chdir(testDir);

async function testPlusPattern() {
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

      const fooBar = await getFiles(lib.name, module, '+(foo|bar).js');
      console.log(`  +(foo|bar).js: ${fooBar.length} files (${fooBar.join(', ')})`);

      const digits = await getFiles(lib.name, module, 'test+(1|2).txt');
      console.log(`  test+(1|2).txt: ${digits.length} files (${digits.join(', ')})`);

      const repeated = await getFiles(lib.name, module, '+(foo)+.js');
      console.log(`  +(foo)+.js: ${repeated.length} files (${repeated.join(', ')})`);

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

testPlusPattern().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
