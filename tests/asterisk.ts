import { mkdir, writeFile, rm } from "fs/promises";
import { join } from "path";
import { styleText } from "node:util";
import { glob } from "glob";
import fastGlob from "fast-glob";
import { globby } from "globby";
import tinyGlob from "tiny-glob";
import { glob as tinyglobby } from "tinyglobby";
import { globSync as nodeGlobSync } from "node:fs";

const FIXTURE_DIR = "test-fixtures";

const FILES = [
  "abc",
  "abd",
  "abe",
  "bb",
  "bcd",
  "ca",
  "cb",
  "dd",
  "de",
  "foo.js",
  "bar.js",
  "baz.txt",
  "FOO.JS",
  "file.txt",
  ".hidden",
  ".config",
  "regular.js",
  "a/file1",
  "a/file2",
  "a/sub/file3",
  "dir/subdir/bash.1",
];

const PATTERNS = [
  "*",
  "*.js",
  "f*",
  "*b",
  "*.*",
  "f*b",
  ".*",
  "a/*",
  "*/subdir/bash.*",
];

async function setupFixtures(): Promise<void> {
  await rm(FIXTURE_DIR, { recursive: true, force: true });

  for (const file of FILES) {
    const fullPath = join(FIXTURE_DIR, file);
    await mkdir(join(fullPath, ".."), { recursive: true });
    await writeFile(fullPath, "");
  }
}

async function runTests(): Promise<void> {
  await setupFixtures();

  try {
    for (const pattern of PATTERNS) {
      console.log(styleText("bold", `"${pattern}"`));
      const p = `${FIXTURE_DIR}/${pattern}`;

      {
        const results = (await glob(p)).sort();
        console.log(`  glob (${results.length}): ${styleText("gray", results.join(", "))}`);
      }
      {
        const results = (await fastGlob(p)).sort();
        console.log(`  fast-glob (${results.length}): ${styleText("gray", results.join(", "))}`);
      }
      {
        const results = (await globby(p)).sort();
        console.log(`  globby (${results.length}): ${styleText("gray", results.join(", "))}`);
      }
      {
        const results = (await tinyGlob(p)).sort();
        console.log(`  tiny-glob (${results.length}): ${styleText("gray", results.join(", "))}`);
      }
      {
        const results = (await tinyglobby(p)).sort();
        console.log(`  tinyglobby (${results.length}): ${styleText("gray", results.join(", "))}`);
      }
      {
        const results = nodeGlobSync(p).sort();
        console.log(`  node:fs (${results.length}): ${styleText("gray", results.join(", "))}`);
      }

      console.log("");
    }
  } finally {
    await rm(FIXTURE_DIR, { recursive: true, force: true });
  }
}

runTests().catch(console.error);
