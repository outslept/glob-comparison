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
  "a.js",
  "b.js",
  "c.js",
  "z.js",
  "ab.js",
  "ac.js",
  "az.js",
  "abc.js",
  "abd.js",
  "xyz.js",
  "file1.txt",
  "file2.txt",
  "file9.txt",
  "test.js",
  "main.js",
  "app.css",
  "a.b",
  "x.y",
  "z.z",
  "a",
  "b",
  "c",
  ".hidden",
  ".config",
  "file-a.js",
  "file-b.js",
  "test_1.js",
  "test_2.js",
  "x.html",
  "y.html",
  "z.html",
];

const PATTERNS = [
  "?.js",
  "??.js",
  "???.js",
  "file?.txt",
  "file?.js",
  "?est.js",
  "a??.js",
  "?a?.js",
  "?.?",
  "?.*",
  ".*?",
  "?",
  "test??.js",
  "file-?.js",
  "test_?.js",
  "a?.js",
  "?z.js",
  "?.html",
  "???.css",
  ".?.*",
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
