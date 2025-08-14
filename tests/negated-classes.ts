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
  "d.js",
  "e.js",
  "z.js",
  "A.js",
  "B.js",
  "C.js",
  "D.js",
  "Z.js",
  "1.txt",
  "2.txt",
  "3.txt",
  "4.txt",
  "9.txt",
  "file-a.js",
  "file-b.js",
  "file-d.js",
  "file-z.js",
  "test1.js",
  "test2.js",
  "test4.js",
  "test9.js",
  "app.css",
  "main.css",
  "style.css",
  "base.css",
  "x.html",
  "y.html",
  "z.html",
];

const PATTERNS = [
  "[!abc].js",
  "[!a-c].js",
  "[!A-C].js",
  "[!1-3].txt",
  "[^abc].js",
  "[^a-c].js",
  "[^A-C].js",
  "[^1-3].txt",
  "file-[!abc].js",
  "file-[^abc].js",
  "test[!123].js",
  "test[^123].js",
  "file-[!a-d].js",
  "file-[!-].js",
  "*[!s].css",
  "[!A-Z].js",
  "[^A-Z].js",
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
