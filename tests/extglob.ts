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
  "file.ts",
  "file.css",
  "file.html",
  "app.js",
  "app.ts",
  "app.min.js",
  "app.dev.js",
  "app.prod.js",
  "test.js",
  "test.spec.js",
  "test.unit.js",
  "test.config.js",
  "main.js",
  "main.min.js",
  "main.dev.js",
  "style.css",
  "style.min.css",
  "style.scss",
  "component.jsx",
  "component.tsx",
  "component.vue",
  "foo.js",
  "bar.js",
  "baz.js",
  "qux.js",
  "readme.md",
  "changelog.md",
  "license.txt",
  "config.json",
  "package.json",
  "tsconfig.json",
];

const PATTERNS = [
  "*.*(js|ts)",
  "app.*(min|dev|prod).js",
  "file.*(css|scss|sass)",
  "*(test|spec).js",
  "*(foo|bar|baz).js",
  "file.@(js|ts|css)",
  "app.@(min|dev).js",
  "test.@(spec|unit).js",
  "@(main|app).js",
  "@(foo|bar).js",
  "!(foo|bar).js",
  "!(test|app)*.js",
  "!(*.html)",
  "!(foo).js",
  "app.!(min).js",
  "test.!(spec).js",
  "component.!(html)",
  "file.+(js|ts)",
  "app.+(min|dev|prod).js",
  "+(test|main).js",
  "+(foo|bar|baz).js",
  "style.+(css|scss)",
  "file.?(min.)js",
  "app.?(dev.)js",
  "test.?(spec.)js",
  "style.?(min.)css",
  "?(main|app).js",
  "*.!(js|ts)",
  "@(readme|changelog).md",
  "!(readme|changelog).md",
  "!(config|package|tsconfig).json",
  "!(foo|bar).@(js|ts)",
  "@(foo|bar)*.js",
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
