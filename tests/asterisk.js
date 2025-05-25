const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'file.js'), '');
fs.writeFileSync(path.join(testDir, 'test.js'), '');
fs.writeFileSync(path.join(testDir, 'app.txt'), '');
fs.writeFileSync(path.join(testDir, 'data.json'), '');
fs.writeFileSync(path.join(testDir, 'config'), '');
fs.writeFileSync(path.join(testDir, 'a'), '');
fs.writeFileSync(path.join(testDir, 'ab'), '');
fs.writeFileSync(path.join(testDir, 'abc'), '');

process.chdir(testDir);

async function testAsterisk() {
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

      const allFiles = await getFiles(lib.name, module, '*');
      console.log(`  *: ${allFiles.length} files (${allFiles.join(', ')})`);

      const jsFiles = await getFiles(lib.name, module, '*.js');
      console.log(`  *.js: ${jsFiles.length} files (${jsFiles.join(', ')})`);

      const aFiles = await getFiles(lib.name, module, 'a*');
      console.log(`  a*: ${aFiles.length} files (${aFiles.join(', ')})`);

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

testAsterisk().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
