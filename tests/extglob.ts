import { mkdir, writeFile, rm } from "fs/promises";
import { join } from "path";
import { styleText } from "node:util";
import { glob } from "glob";
import fastGlob from "fast-glob";
import { globby } from "globby";
import tinyGlob from "tiny-glob";
import { glob as tinyglobby } from "tinyglobby";
import { globSync as nodeGlobSync } from "node:fs";
import normalizePath from "../internal/normalize-path.js";

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
  // Zero or more *(pattern)
  "*.*(js|ts)",
  "app.*(min|dev|prod).js",
  "file.*(css|scss|sass)",
  "*(test|spec).js",
  "*(foo|bar|baz).js",

  // Exactly one @(pattern)
  "file.@(js|ts|css)",
  "app.@(min|dev).js",
  "test.@(spec|unit).js",
  "@(main|app).js",
  "@(foo|bar).js",

  // Negation !(pattern)
  "!(foo|bar).js",
  "!(test|app)*.js",
  "!(*.html)",
  "!(foo).js",
  "app.!(min).js",
  "test.!(spec).js",
  "component.!(html)",

  // One or more +(pattern)
  "file.+(js|ts)",
  "app.+(min|dev|prod).js",
  "+(test|main).js",
  "+(foo|bar|baz).js",
  "style.+(css|scss)",

  // Zero or one ?(pattern)
  "file.?(min.)js",
  "app.?(dev.)js",
  "test.?(spec.)js",
  "style.?(min.)css",
  "?(main|app).js",
];

const LIBS: Record<string, (pattern: string) => Promise<string[]>> = {
  glob: (pattern: string) => glob(pattern),
  "fast-glob": (pattern: string) => fastGlob(pattern),
  globby: (pattern: string) => globby(pattern),
  "tiny-glob": (pattern: string) => tinyGlob(pattern),
  tinyglobby: (pattern: string) => tinyglobby(pattern),
  "node:fs": (pattern: string) => Promise.resolve(nodeGlobSync(pattern)),
};

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

      for (const [libName, libFunc] of Object.entries(LIBS)) {
        try {
          const results = await libFunc(`${FIXTURE_DIR}/${pattern}`);
          console.log(
            `  ${libName} (${results.length}): ${styleText(
              "gray",
              results
                .map((path) => normalizePath(path))
                .join(", "),
            )}`,
          );
        } catch (error) {
          console.log(
            `  ${styleText("gray", libName)} (ERROR): ${String(error)}`,
          );
        }
      }
      console.log("");
    }
  } finally {
    await rm(FIXTURE_DIR, { recursive: true, force: true });
  }
}

runTests().catch(console.error);
