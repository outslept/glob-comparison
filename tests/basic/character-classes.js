const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'a.js'), '');
fs.writeFileSync(path.join(testDir, 'b.js'), '');
fs.writeFileSync(path.join(testDir, 'c.js'), '');
fs.writeFileSync(path.join(testDir, 'd.js'), '');
fs.writeFileSync(path.join(testDir, 'file1.txt'), '');
fs.writeFileSync(path.join(testDir, 'file2.txt'), '');
fs.writeFileSync(path.join(testDir, 'file3.txt'), '');
fs.writeFileSync(path.join(testDir, 'file9.txt'), '');
fs.writeFileSync(path.join(testDir, 'test.log'), '');

process.chdir(testDir);

async function testCharacterClasses() {
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

      const abcFiles = await getFiles(lib.name, module, '[abc].js');
      console.log(`  [abc].js: ${abcFiles.length} files (${abcFiles.join(', ')})`);

      const digitFiles = await getFiles(lib.name, module, 'file[123].txt');
      console.log(`  file[123].txt: ${digitFiles.length} files (${digitFiles.join(', ')})`);

      const multiChar = await getFiles(lib.name, module, '[td]*');
      console.log(`  [td]*: ${multiChar.length} files (${multiChar.join(', ')})`);


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

testCharacterClasses().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
