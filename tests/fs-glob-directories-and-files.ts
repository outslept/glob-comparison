import { mkdir, writeFile, rm } from "fs/promises";
import { statSync } from "fs";
import { join } from "path";
import { styleText } from "node:util";
import { globSync as fsGlobSync } from "node:fs";

const FIXTURE_DIR = "test-fixtures";

const FILES = [
  "file.js",
  "README.md",
  "a/file.txt",
  "a/sub/inner.txt",
  "src/index.js",
  "src/utils/helper.js",
  "lib/plugins/auth.js",
  ".hidden",
  ".config",
  ".dotdir/index.js",
  ".dotdir/sub/inner.txt",
  "nested/.dotfile",
  "nested/.d/inner.js",
];

const DIR_FILE_PATTERNS = [
  "*",
  "**",
  "**/*",
  "*/",
  "**/",
  "src/**",
  "src/**/*"
];

const DOT_PATTERNS = [
  "*",
  ".*",
  "**/.*",
  ".*/**/*",
  "**/.*/**/*",
];

async function setupFixtures(): Promise<void> {
  await rm(FIXTURE_DIR, { recursive: true, force: true });

  for (const file of FILES) {
    const fullPath = join(FIXTURE_DIR, file);
    await mkdir(join(fullPath, ".."), { recursive: true });
    await writeFile(fullPath, "");
  }
}

function annotate(results: string[]): string[] {
  return results
    .map(p => `${statSync(p).isDirectory() ? "[D]" : "[F]"} ${p}`)
    .sort();
}

async function runTests(): Promise<void> {
  await setupFixtures();

  try {
    console.log(styleText("bold", "\nDirectories vs Files (node:fs.glob defaults)\n"));

    for (const pattern of DIR_FILE_PATTERNS) {
      console.log(styleText("bold", `"${pattern}"`));
      const p = `${FIXTURE_DIR}/${pattern}`;
      const results = fsGlobSync(p);
      const labeled = annotate(results);
      console.log(`  node:fs (${results.length}): ${styleText("gray", labeled.join(", "))}\n`);
    }

    console.log(styleText("bold", "\nDotfiles (node:fs.glob defaults)\n"));

    for (const pattern of DOT_PATTERNS) {
      console.log(styleText("bold", `"${pattern}"`));
      const p = `${FIXTURE_DIR}/${pattern}`;
      const results = fsGlobSync(p);
      const labeled = annotate(results);
      console.log(`  node:fs (${results.length}): ${styleText("gray", labeled.join(", "))}\n`);
    }
  } finally {
    await rm(FIXTURE_DIR, { recursive: true, force: true });
  }
}

runTests().catch(console.error);
