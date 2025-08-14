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
  "app.js",
  "app.ts",
  "app.jsx",
  "app.tsx",
  "app.css",
  "config.js",
  "config.json",
  "config.yaml",
  "config.yml",
  "test.spec.js",
  "test.test.js",
  "main.spec.js",
  "main.test.js",
  "file1.txt",
  "file2.txt",
  "file3.txt",
  "file4.txt",
  "file5.txt",
  "file01.txt",
  "file02.txt",
  "file03.txt",
  "file04.txt",
  "file05.txt",
  "component.vue",
  "component.jsx",
  "component.tsx",
  "style.css",
  "style.scss",
  "style.sass",
  "data.json",
  "data.xml",
  "data.yaml",
  "foo.js",
  "bar.js",
  "baz.js",
];

const PATTERNS = [
  "app.{js,ts}",
  "config.{js,json}",
  "*.{js,ts,css}",
  "*.{spec,test}.js",
  "app.{js,ts,jsx}",
  "style.{css,scss}",
  "{app,config}.{js,json}",
  "{test,main}.{spec,test}.js",
  "{style,app}.{css,js}",
  "file{1..3}.txt",
  "file{1..5}.txt",
  "file{2..4}.txt",
  "file{01..03}.txt",
  "file{01..05}.txt",
  "file{02..04}.txt",
  "app.{js}",
  "{foo,bar,baz}.js",
  "data.{json,xml,yaml}",
  "component.{vue,jsx,tsx}",
  "file{1..5..2}.txt",
  "file{5..3}.txt",
  "{app,{config,data}}.{js,json}"
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
