const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'a.js'), '');
fs.writeFileSync(path.join(testDir, 'f.js'), '');
fs.writeFileSync(path.join(testDir, 'z.js'), '');
fs.writeFileSync(path.join(testDir, 'A.js'), '');
fs.writeFileSync(path.join(testDir, '1.js'), '');
fs.writeFileSync(path.join(testDir, 'file0.txt'), '');
fs.writeFileSync(path.join(testDir, 'file5.txt'), '');
fs.writeFileSync(path.join(testDir, 'file9.txt'), '');
fs.writeFileSync(path.join(testDir, 'fileA.txt'), '');

process.chdir(testDir);

async function testCharacterRanges() {
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

      const lowerCase = await getFiles(lib.name, module, '[a-z].js');
      console.log(`  [a-z].js: ${lowerCase.length} files (${lowerCase.join(', ')})`);

      const digits = await getFiles(lib.name, module, 'file[0-9].txt');
      console.log(`  file[0-9].txt: ${digits.length} files (${digits.join(', ')})`);

      const alphaNum = await getFiles(lib.name, module, 'file[0-9A-Z].txt');
      console.log(`  file[0-9A-Z].txt: ${alphaNum.length} files (${alphaNum.join(', ')})`);

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

testCharacterRanges().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
