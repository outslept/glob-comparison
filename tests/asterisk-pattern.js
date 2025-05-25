const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'file.js'), '');
fs.writeFileSync(path.join(testDir, 'filetest.js'), '');
fs.writeFileSync(path.join(testDir, 'filetesttest.js'), '');
fs.writeFileSync(path.join(testDir, 'app.txt'), '');
fs.writeFileSync(path.join(testDir, 'appbak.txt'), '');
fs.writeFileSync(path.join(testDir, 'appbakbak.txt'), '');
fs.writeFileSync(path.join(testDir, 'other.js'), '');

process.chdir(testDir);

async function testAsteriskPattern() {
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

      const zeroOrMore = await getFiles(lib.name, module, 'file*(test).js');
      console.log(`  file*(test).js: ${zeroOrMore.length} files (${zeroOrMore.join(', ')})`);

      const appPattern = await getFiles(lib.name, module, 'app*(bak).txt');
      console.log(`  app*(bak).txt: ${appPattern.length} files (${appPattern.join(', ')})`);

      const anyRepeat = await getFiles(lib.name, module, '*(file|app)*');
      console.log(`  *(file|app)*: ${anyRepeat.length} files (${anyRepeat.join(', ')})`);

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

testAsteriskPattern().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
