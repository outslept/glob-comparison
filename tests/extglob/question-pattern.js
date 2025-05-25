const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'file.js'), '');
fs.writeFileSync(path.join(testDir, 'files.js'), '');
fs.writeFileSync(path.join(testDir, 'test.txt'), '');
fs.writeFileSync(path.join(testDir, 'tests.txt'), '');
fs.writeFileSync(path.join(testDir, 'app.js'), '');
fs.writeFileSync(path.join(testDir, 'config.json'), '');
fs.writeFileSync(path.join(testDir, 'configs.json'), '');

process.chdir(testDir);

async function testQuestionPattern() {
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

      const optionalS = await getFiles(lib.name, module, 'file?(s).js');
      console.log(`  file?(s).js: ${optionalS.length} files (${optionalS.join(', ')})`);

      const optionalExt = await getFiles(lib.name, module, 'config?(s).json');
      console.log(`  config?(s).json: ${optionalExt.length} files (${optionalExt.join(', ')})`);

      const optionalPattern = await getFiles(lib.name, module, 'test?(s).txt');
      console.log(`  test?(s).txt: ${optionalPattern.length} files (${optionalPattern.join(', ')})`);

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

testQuestionPattern().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
