const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'a.js'), '');
fs.writeFileSync(path.join(testDir, 'b.js'), '');
fs.writeFileSync(path.join(testDir, 'c.js'), '');
fs.writeFileSync(path.join(testDir, 'd.js'), '');
fs.writeFileSync(path.join(testDir, 'e.js'), '');
fs.writeFileSync(path.join(testDir, 'file1.txt'), '');
fs.writeFileSync(path.join(testDir, 'file2.txt'), '');
fs.writeFileSync(path.join(testDir, 'file3.txt'), '');
fs.writeFileSync(path.join(testDir, 'file9.txt'), '');

process.chdir(testDir);

async function testNegatedClasses() {
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

      const notAbc = await getFiles(lib.name, module, '[!abc].js');
      console.log(`  [!abc].js: ${notAbc.length} files (${notAbc.join(', ')})`);

      const notDigits = await getFiles(lib.name, module, 'file[!123].txt');
      console.log(`  file[!123].txt: ${notDigits.length} files (${notDigits.join(', ')})`);

      const notRange = await getFiles(lib.name, module, '[!a-c].js');
      console.log(`  [!a-c].js: ${notRange.length} files (${notRange.join(', ')})`);

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

testNegatedClasses().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
