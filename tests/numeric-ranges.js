const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'file1.txt'), '');
fs.writeFileSync(path.join(testDir, 'file2.txt'), '');
fs.writeFileSync(path.join(testDir, 'file3.txt'), '');
fs.writeFileSync(path.join(testDir, 'file4.txt'), '');
fs.writeFileSync(path.join(testDir, 'file9.txt'), '');
fs.writeFileSync(path.join(testDir, 'test01.js'), '');
fs.writeFileSync(path.join(testDir, 'test02.js'), '');
fs.writeFileSync(path.join(testDir, 'test05.js'), '');

process.chdir(testDir);

async function testNumericRanges() {
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

      const range13 = await getFiles(lib.name, module, 'file{1..3}.txt');
      console.log(`  file{1..3}.txt: ${range13.length} files (${range13.join(', ')})`);

      const range02 = await getFiles(lib.name, module, 'test{01..02}.js');
      console.log(`  test{01..02}.js: ${range02.length} files (${range02.join(', ')})`);

      const range14 = await getFiles(lib.name, module, 'file{1..4}.txt');
      console.log(`  file{1..4}.txt: ${range14.length} files (${range14.join(', ')})`);

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
    default:
      throw new Error(`Unknown library: ${libName}`);
  }
}

testNumericRanges().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
