/* eslint-disable no-console */
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";

const libraries = [
  { name: "fast-glob", pkg: "fast-glob" },
  { name: "glob", pkg: "glob" },
  { name: "globby", pkg: "globby" },
  { name: "tiny-glob", pkg: "tiny-glob" },
  { name: "tinyglobby", pkg: "tinyglobby" },
];

async function testGlobLibraries(testConfig) {
  const {
    testName,
    files,
    directories = [],
    patterns,
    options = {},
    setup,
  } = testConfig;

  const tempDir = join(tmpdir(), `glob-test-${Date.now()}`);
  const testDir = join(tempDir, "test");

  mkdirSync(testDir, { recursive: true });

  directories.forEach((dirPath) =>
    mkdirSync(join(testDir, dirPath), { recursive: true }),
  );

  files.forEach((fileName) => {
    const filePath = join(testDir, fileName);
    const dir = dirname(filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, "");
  });

  if (testName === "Gitignore Support") {
    writeFileSync(join(testDir, ".gitignore"), "*.tmp\nignored.txt\n");
  }

  setup?.(testDir);

  const originalCwd = process.cwd();
  process.chdir(testDir);

  console.log(`\n=== ${testName} ===`);

  try {
    for (const lib of libraries) {
      console.log(`\n${lib.name}:`);

      try {
        const module = await import(lib.pkg);

        for (const patternConfig of patterns) {
          const [pattern, patternOptions] =
            typeof patternConfig === "string" || Array.isArray(patternConfig)
              ? [patternConfig, options]
              : patternConfig.pattern
                ? [
                    patternConfig.pattern,
                    { ...options, ...patternConfig.options },
                  ]
                : [patternConfig, options];

          const files = await getFiles(
            lib.name,
            module,
            pattern,
            patternOptions,
          );
          const patternStr = Array.isArray(pattern)
            ? pattern.join(", ")
            : pattern;

          const isObjectArray =
            Array.isArray(files) &&
            files.length > 0 &&
            typeof files[0] === "object" &&
            files[0] !== null &&
            !Array.isArray(files[0]);

          const filesStr = isObjectArray
            ? `${files.length} items (objects)`
            : files.length === 0
              ? "no matches"
              : files.length > 10
                ? `${files.length} files`
                : files.join(", ");

          console.log(`  ${patternStr}: ${filesStr}`);
        }
      } catch (error) {
        console.log(`  Not installed or error: ${error.message}`);
      }
    }
  } finally {
    process.chdir(originalCwd);
    rmSync(tempDir, { recursive: true, force: true });
  }
}

async function getFiles(libName, module, pattern, options = {}) {
  const opts = normalizeOptions(libName, options);

  switch (libName) {
    case "fast-glob":
      return await module.default(pattern, opts);
    case "glob":
      return await module.glob(pattern, opts);
    case "globby":
      return await module.globby(pattern, opts);
    case "tiny-glob":
      return await module.default(pattern, opts);
    case "tinyglobby":
      return await module.glob(pattern, opts);
    default:
      return [];
  }
}

function normalizeOptions(libName, options) {
  const opts = {};

  if (options.ignore) opts.ignore = options.ignore;
  if (options.gitignore && libName === "globby") opts.gitignore = true;
  if (options.absolute) opts.absolute = true;
  if (options.dot) opts.dot = true;

  if (options.caseSensitive !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(libName)) {
      opts.caseSensitiveMatch = options.caseSensitive;
    } else if (libName === "glob") {
      opts.nocase = !options.caseSensitive;
    }
  }

  if (options.depth !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(libName)) {
      opts.deep = options.depth;
    } else if (libName === "glob") {
      opts.maxDepth = options.depth;
    }
  }

  if (
    options.onlyDirectories &&
    ["fast-glob", "tinyglobby"].includes(libName)
  ) {
    opts.onlyDirectories = true;
  }

  if (
    options.onlyFiles !== undefined &&
    ["fast-glob", "globby", "tinyglobby"].includes(libName)
  ) {
    opts.onlyFiles = options.onlyFiles;
  }

  if (options.markDirectories) {
    if (["fast-glob", "tinyglobby"].includes(libName)) {
      opts.markDirectories = true;
    } else if (libName === "glob") {
      opts.mark = true;
    }
  }

  if (options.objectMode) {
    if (["fast-glob", "tinyglobby"].includes(libName)) {
      opts.objectMode = true;
    } else if (libName === "glob") {
      opts.withFileTypes = true;
    }
  }

  if (options.extglob !== false && libName === "glob") {
    opts.extglob = true;
  }

  return opts;
}

const commonTests = [
  {
    testName: "Asterisk Patterns",
    files: [
      "foo.js",
      "bar.js",
      "baz.txt",
      "qux.json",
      "config",
      "a",
      "ab",
      "abc",
      "abcdef",
      "foo_bar_baz.js",
      "start_end.txt",
      "x.y.z",
      "foo.bar.baz.with.dots.js",
      "short.js",
      "verylongfilename.txt",
    ],
    patterns: [
      "*",
      "*.js",
      "a*",
      "*.txt",
      "*.*", // files with extension
      "*.*.*", // files with multiple dots
      "*.*.js", // JS files with dot in name
      "*foo*", // contains "foo"
      "*_*", // contains underscore
      "a*c", // starts with 'a', ends with 'c'
      "foo*baz*", // starts with foo, contains baz
      "***",
      "a*b*c", // a, then something, then b, then something, then c
      "*_*_*", // two underscores with something between
      "*.*.*.js", // JS files with at least 3 dots
    ],
  },
  // {
  //   testName: "Character Classes",
  //   files: [
  //     "a.js",
  //     "b.js",
  //     "c.js",
  //     "d.js",
  //     "z.js",
  //     "foo1.txt",
  //     "foo2.txt",
  //     "foo3.txt",
  //     "foo9.txt",
  //     "A.js",
  //     "B.js",
  //     "bar-.txt",
  //     "bar_.txt",
  //     "baz10.txt",
  //   ],
  //   patterns: [
  //     "[abc].js", // matches a.js, b.js, c.js
  //     "foo[123].txt", // matches foo1.txt, foo2.txt, foo3.txt
  //     "[a-c].js", // range test
  //     "[a-z].js", // full alphabet range
  //     "foo[0-9].txt", // digit range
  //     "[a-cA-C].js", // mixed case ranges
  //     "[az].js", // first and last without range
  //     "bar[-_].txt", // special chars in class
  //     "[9-1].txt", // should not match anything
  //   ],
  // },
  // {
  //   testName: "Negated Classes",
  //   files: [
  //     "a.js",
  //     "b.js",
  //     "c.js",
  //     "d.js",
  //     "z.js",
  //     "foo1.txt",
  //     "foo2.txt",
  //     "foo3.txt",
  //     "foo9.txt",
  //     "bar.js",
  //     "baz.js",
  //   ],
  //   patterns: [
  //     "[!abc].js", // should match: d.js, z.js, bar.js, baz.js
  //     "foo[!123].txt", // should match: foo9.txt
  //     "[!a-c].js", // should match: d.js, z.js, bar.js, baz.js
  //     "foo[!1-3].txt", // should match: foo9.txt
  //     "[!az].js", // should match: b.js, c.js, d.js, bar.js, baz.js
  //     "[!].js", // invalid - should test error handling
  //     "[!a-z].js", // should match nothing (all files have lowercase letters)
  //   ],
  // },
  // {
  //   testName: "Question Mark",
  //   files: [
  //     "a.js",
  //     "b.js",
  //     "ab.js",
  //     "abc.js",
  //     "file1.txt",
  //     "file22.txt",
  //     "x",
  //     "xy",
  //   ],
  //   patterns: ["?.js", "file?.txt", "?"],
  // },
  // {
  //   testName: "Brace Expansion",
  //   files: [
  //     "app.js",
  //     "app.ts",
  //     "app.css",
  //     "test.spec.js",
  //     "test.test.js",
  //     "config.json",
  //   ],
  //   patterns: ["app.{js,ts,css}", "*.{spec,test}.js", "{app,config}.{js,json}"],
  // },
  // {
  //   testName: "Globstar Pattern",
  //   directories: ["src", "src/components", "tests"],
  //   files: [
  //     "app.js",
  //     "src/index.js",
  //     "src/components/button.js",
  //     "tests/test.js",
  //   ],
  //   patterns: ["**/*.js", "src/**/*.js", "**/components/*.js"],
  // },
  // {
  //   testName: "Extended Glob - At Pattern",
  //   files: [
  //     "foo.js",
  //     "bar.js",
  //     "baz.js",
  //     "foobar.js",
  //     "test.spec.js",
  //     "test.test.js",
  //   ],
  //   patterns: ["@(foo|bar).js", "test.@(spec|test).js"],
  //   options: { extglob: true },
  // },
  // {
  //   testName: "Extended Glob - Plus Pattern",
  //   files: ["foo.js", "bar.js", "foobar.js", "foofoo.js", "baz.js"],
  //   patterns: ["+(foo|bar).js", "+(foo)+.js"],
  //   options: { extglob: true },
  // },
  // {
  //   testName: "Negation Patterns",
  //   files: ["app.js", "test.js", "config.js", "ignore.js", "file.txt"],
  //   patterns: [
  //     ["*.js", "!ignore.js"],
  //     ["*", "!*.txt"],
  //     ["*.js", "!test.js", "!config.js"],
  //   ],
  // },
  // {
  //   testName: "Ignore Options",
  //   files: ["app.js", "test.js", "config.json", "temp.tmp", "build.log"],
  //   patterns: [
  //     { pattern: "*", options: {} },
  //     { pattern: "*", options: { ignore: ["*.tmp"] } },
  //     { pattern: "*", options: { ignore: ["*.js", "*.log"] } },
  //   ],
  // },
  // {
  //   testName: "Gitignore Support",
  //   files: [
  //     "app.js",
  //     "test.js",
  //     "ignored.txt",
  //     "temp.tmp",
  //     "config.json",
  //     ".gitignore",
  //   ],
  //   patterns: [
  //     { pattern: "*", options: { gitignore: true } },
  //     { pattern: "*", options: {} },
  //   ],
  // },
  // {
  //   testName: "Absolute Paths",
  //   files: ["app.js", "test.js", "config.json"],
  //   patterns: [{ pattern: "*.js", options: { absolute: true } }],
  // },
  // {
  //   testName: "Case Sensitivity",
  //   files: ["App.js", "app.js", "TEST.js", "test.js"],
  //   patterns: [
  //     { pattern: "app.js", options: { caseSensitive: true } },
  //     { pattern: "app.js", options: { caseSensitive: false } },
  //   ],
  // },
  // {
  //   testName: "Depth Limiting",
  //   directories: ["level1", "level1/level2", "level1/level2/level3"],
  //   files: [
  //     "root.js",
  //     "level1/file1.js",
  //     "level1/level2/file2.js",
  //     "level1/level2/level3/file3.js",
  //   ],
  //   patterns: [
  //     { pattern: "**/*.js", options: {} },
  //     { pattern: "**/*.js", options: { depth: 1 } },
  //     { pattern: "**/*.js", options: { depth: 2 } },
  //   ],
  // },
  // {
  //   testName: "Directories Only",
  //   directories: ["src", "dist", "node_modules"],
  //   files: ["app.js", "test.js", "config.json"],
  //   patterns: [
  //     { pattern: "*", options: { onlyDirectories: true } },
  //     { pattern: "*", options: {} },
  //   ],
  // },
  // {
  //   testName: "Files Only",
  //   directories: ["src", "dist", "node_modules"],
  //   files: ["app.js", "test.js", "config.json"],
  //   patterns: [
  //     { pattern: "*", options: { onlyFiles: true } },
  //     { pattern: "*", options: {} },
  //   ],
  // },
  // {
  //   testName: "Dot Files",
  //   files: ["app.js", "test.js", ".env", ".gitignore", ".hidden.js"],
  //   patterns: [
  //     { pattern: "*", options: { dot: true } },
  //     { pattern: "*", options: {} },
  //     { pattern: ".*", options: { dot: true } },
  //   ],
  // },
  // {
  //   testName: "Mark Directories",
  //   directories: ["src", "dist"],
  //   files: ["app.js", "test.js"],
  //   patterns: [
  //     { pattern: "*", options: { markDirectories: true, onlyFiles: false } },
  //   ],
  // },
  // {
  //   testName: "Object Mode",
  //   directories: ["src"],
  //   files: ["app.js", "test.js", "config.json"],
  //   patterns: [{ pattern: "*", options: { objectMode: true } }],
  // },
  // {
  //   testName: "Multiple Patterns",
  //   files: ["app.js", "test.js", "config.json", "data.txt", "style.css"],
  //   patterns: [
  //     ["*.js", "*.json"],
  //     ["*.js", "*.css", "*.json"],
  //     ["*.txt", "*.css"],
  //   ],
  // },
  // {
  //   testName: "Special Characters in Names",
  //   files: [
  //     "file with spaces.js",
  //     "file-with-dashes.js",
  //     "file_with_underscores.js",
  //     "file.with.dots.js",
  //   ],
  //   patterns: ["*spaces*.js", "*-*-*.js", "*_*_*.js", "*.*.*.js"],
  // },
];

// const platformTests =
//   process.platform === "win32"
//     ? [
//         {
//           testName: "Windows Drive Letters",
//           files: ["app.js", "test.js"],
//           patterns: [String.raw`C:\**\*.js`, "*.js"],
//           setup: (testDir) =>
//             console.log(`  Testing drive letter patterns in: ${testDir}`),
//         },
//         {
//           testName: "Windows Hidden Files",
//           files: [
//             "desktop.ini",
//             "thumbs.db",
//             "System Volume Information",
//             "app.js",
//             "test.js",
//           ],
//           patterns: ["*", "desktop.ini", "thumbs.db", "System*"],
//           setup: (testDir) => {
//             try {
//               execSync(`attrib +h "${join(testDir, "desktop.ini")}"`, {
//                 stdio: "ignore",
//               });
//               execSync(`attrib +h "${join(testDir, "thumbs.db")}"`, {
//                 stdio: "ignore",
//               });
//             } catch {}
//           },
//         },
//         {
//           testName: "Windows Path Separators",
//           directories: [String.raw`src\components`, "src/utils"],
//           files: [String.raw`src\components\Button.js`, "src/utils/helper.js"],
//           patterns: [
//             String.raw`src\**\*.js`,
//             "src/**/*.js",
//             String.raw`src\components\*.js`,
//             "src/utils/*.js",
//           ],
//         },
//       ]
//     : [
//         {
//           testName: "Unix Hidden Files (Dot Files)",
//           files: [
//             "visible.js",
//             ".hidden.js",
//             ".bashrc",
//             ".profile",
//             "normal.txt",
//           ],
//           patterns: [
//             { pattern: "*", options: { dot: false } },
//             { pattern: "*", options: { dot: true } },
//             { pattern: ".*", options: { dot: true } },
//             { pattern: ".hidden*", options: { dot: true } },
//           ],
//         },
//         {
//           testName: "Unix Special Files",
//           files: ["app.js", "script.sh", "data.txt"],
//           patterns: ["*", "*.sh", "*.js"],
//           setup: (testDir) => {
//             try {
//               chmodSync(join(testDir, "script.sh"), 0o755);
//             } catch {}
//           },
//         },
//         {
//           testName: "Symbolic Links (Unix)",
//           files: ["real.js", "target.txt"],
//           patterns: ["*", "*.js", "*link*"],
//           setup: (testDir) => {
//             try {
//               symlinkSync(join(testDir, "real.js"), join(testDir, "link.js"));
//               symlinkSync(
//                 join(testDir, "target.txt"),
//                 join(testDir, "textlink.txt"),
//               );
//             } catch (error) {
//               console.log(`    Symlink creation failed: ${error.message}`);
//             }
//           },
//         },
//       ];

const allTests = [
  ...commonTests,
  // ...platformTests
];

console.log(`\nRunning tests on ${process.platform} platform\n`);
console.log(`Total tests: ${allTests.length} (${commonTests.length} common)`);

for (const test of allTests) {
  await testGlobLibraries(test);
}
