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
  "file.js",
  "src/index.js",
  "src/main.js",
  "src/components/Button.js",
  "src/components/Input.js",
  "src/utils/helper.js",
  "src/utils/math/calc.js",
  "src/utils/string/format.js",
  "lib/core.js",
  "lib/plugins/auth.js",
  "lib/plugins/cache/redis.js",
  "tests/unit/app.test.js",
  "tests/integration/api.test.js",
  "docs/readme.md",
  "docs/api/endpoints.md",
  "config/dev.json",
  "config/prod.json",
  "dist/bundle.js",
  "dist/assets/style.css",
  "node_modules/package/index.js",
];

const PATTERNS = [
  "**",
  "**/*",
  "**/*.js",
  "src/**/*.js",
  "lib/**/*.js",
  "tests/**/*.js",
  "**/components/*.js",
  "**/plugins/**/*.js",
  "**/utils/*.js",
  "src/**/Button.js",
  "lib/**/auth.js",
  "config/**/*.json",
  "src/**/**/calc.js",
  "lib/**/**/redis.js",
  "**/src/*.js",
  "src/**",
  "**/*.md",
  "{src,lib}/**/*.js",
  "**/test*/**/*.js",
  "**/{components,utils}/*.js",
  "**/index.js",
  "**/*.{js,md}",
  "*/**/*.md",
  "**/node_modules/**/*.js",
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
