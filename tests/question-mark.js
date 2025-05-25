const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'a.js'), '');
fs.writeFileSync(path.join(testDir, 'b.js'), '');
fs.writeFileSync(path.join(testDir, 'ab.js'), '');
fs.writeFileSync(path.join(testDir, 'abc.js'), '');
fs.writeFileSync(path.join(testDir, 'file1.txt'), '');
fs.writeFileSync(path.join(testDir, 'file22.txt'), '');
fs.writeFileSync(path.join(testDir, 'test.js'), '');
fs.writeFileSync(path.join(testDir, 'x'), '');
fs.writeFileSync(path.join(testDir, 'xy'), '');

process.chdir(testDir);

async function testQuestionMark() {
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

      const singleChar = await getFiles(lib.name, module, '?.js');
      console.log(`  ?.js: ${singleChar.length} files (${singleChar.join(', ')})`);

      const filePattern = await getFiles(lib.name, module, 'file?.txt');
      console.log(`  file?.txt: ${filePattern.length} files (${filePattern.join(', ')})`);

      const anyChar = await getFiles(lib.name, module, '?');
      console.log(`  ?: ${anyChar.length} files (${anyChar.join(', ')})`);

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

testQuestionMark().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
