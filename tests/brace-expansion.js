const fs = require('fs');
const path = require('path');

const testDir = path.join(__dirname, 'fixtures');
if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true });
fs.mkdirSync(testDir, { recursive: true });

fs.writeFileSync(path.join(testDir, 'app.js'), '');
fs.writeFileSync(path.join(testDir, 'app.ts'), '');
fs.writeFileSync(path.join(testDir, 'app.css'), '');
fs.writeFileSync(path.join(testDir, 'test.spec.js'), '');
fs.writeFileSync(path.join(testDir, 'test.test.js'), '');
fs.writeFileSync(path.join(testDir, 'config.json'), '');

process.chdir(testDir);

async function testBraceExpansion() {
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

      const extensions = await getFiles(lib.name, module, 'app.{js,ts,css}');
      console.log(`  app.{js,ts,css}: ${extensions.length} files (${extensions.join(', ')})`);

      const testFiles = await getFiles(lib.name, module, '*.{spec,test}.js');
      console.log(`  *.{spec,test}.js: ${testFiles.length} files (${testFiles.join(', ')})`);

      const mixed = await getFiles(lib.name, module, '{app,config}.{js,json}');
      console.log(`  {app,config}.{js,json}: ${mixed.length} files (${mixed.join(', ')})`);

      const works = extensions.length === 3 && testFiles.length === 2 && mixed.length === 2;

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

testBraceExpansion().then(() => {
  process.chdir('..');
  fs.rmSync(testDir, { recursive: true });
}).catch(console.error);
