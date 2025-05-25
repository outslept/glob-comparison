const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.mkdirSync(path.join(testDir, 'src'), { recursive: true });
fs.mkdirSync(path.join(testDir, 'src/components'), { recursive: true });
fs.mkdirSync(path.join(testDir, 'tests'), { recursive: true });

fs.writeFileSync(path.join(testDir, 'app.js'), '');
fs.writeFileSync(path.join(testDir, 'src/index.js'), '');
fs.writeFileSync(path.join(testDir, 'src/components/button.js'), '');
fs.writeFileSync(path.join(testDir, 'tests/test.js'), '');

process.chdir(testDir);

async function testGlobstar() {
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

      const allJs = await getFiles(lib.name, module, '**/*.js');
      console.log(`  **/*.js: ${allJs.length} files (${allJs.join(', ')})`);

      const srcJs = await getFiles(lib.name, module, 'src/**/*.js');
      console.log(`  src/**/*.js: ${srcJs.length} files (${srcJs.join(', ')})`);

      const deepPath = await getFiles(lib.name, module, '**/components/*.js');
      console.log(`  **/components/*.js: ${deepPath.length} files (${deepPath.join(', ')})`);

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

testGlobstar().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
