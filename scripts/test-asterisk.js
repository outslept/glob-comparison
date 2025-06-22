import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "asterisk-test-"));

const files = [
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
  "foobaz",
  "foo_baz",
  "foo.bar.baz",
  "fooXYZbaz",
  "verylongfilename.txt",
];

files.forEach((file) => fs.writeFileSync(path.join(tempDir, file), ""));
process.chdir(tempDir);

const libConfigs = {
  "fast-glob": (m) => m.default,
  glob: (m) => m.glob,
  globby: (m) => m.globby,
  "tiny-glob": (m) => m.default,
  tinyglobby: (m) => m.glob,
};

const tests = [
  ["*", "all files"],
  ["foo*", "files starting with foo"],
  ["*.js", "JS files"],
  ["*config", "files ending with config"],
  ["*bar*", "files containing bar"],
  ["*_*", "files with underscores"],
  ["*.*", "files with dots"],
  ["a*c", "starts with 'a', ends with 'c'"],
  ["foo*baz", "foo*baz pattern"],
];

for (const [pattern, description] of tests) {
  console.log(`\n${pattern} (${description})`);

  for (const [libName, getFn] of Object.entries(libConfigs)) {
    try {
      const module = await import(libName);
      const results = await getFn(module)(pattern);
      console.log(
        `${libName.padEnd(12)}: ${results.length} files - [${results.join(", ")}]`,
      );
    } catch (error) {
      console.log(`${libName.padEnd(12)}: ERROR - ${error.message}`);
    }
  }
}

process.chdir(os.homedir());
fs.rmSync(tempDir, { recursive: true, force: true });
