import { mkdir, writeFile, rm, symlink, chmod } from "fs/promises";
import { join, resolve } from "path";
import { styleText } from "util";
import tinyGlob from "tiny-glob";
import process from "process";

const FIXTURE_DIR = "test-fixtures";

const FILES = [
  "file.js", "file.ts", "file.css", "file.html",
  "app.js", "app.ts", "app.jsx", "app.tsx", "app.css",
  "test.js", "test.spec.js", "test.unit.js", "main.js",
  "File.js", "FILE.JS", "App.JS", "TEST.js",
  "file1.txt", "file2.txt", "file3.txt", "file01.txt", "file02.txt",
  "a.js", "b.js", "c.js", "z.js", "A.js", "B.js", "Z.js",
  "1.txt", "2.txt", "9.txt",
  "file-a.js", "file_b.js", "test-spec.js", "app.min.js", "app.dev.js",
  "config.json", "config.yaml", "config.yml", "data.xml",
  "style.css", "style.scss", "style.sass",
  ".hidden", ".config", ".gitignore", ".env", ".DS_Store",
  "файл.js", "文件.js", "ファイル.js", "🚀rocket.js", "café.js",
  "src/index.js", "src/main.js", "src/app.js",
  "src/components/Button.js", "src/components/Input.js",
  "src/utils/helper.js", "src/utils/math/calc.js",
  "lib/core.js", "lib/plugins/auth.js", "lib/plugins/cache/redis.js",
  "tests/unit/app.test.js", "tests/integration/api.test.js",
  "docs/readme.md", "docs/api/endpoints.md",
  "config/dev.json", "config/prod.json",
  "dist/bundle.js", "dist/assets/style.css",
  "very/deep/nested/path/file.js",
  "a/b/c/d/e/f/g/deep.js",
  "file with spaces.js", "file-with-dashes.js", "file_with_underscores.js",
  "file.with.dots.js", "file@symbol.js", "file#hash.js",
  "path//double//slash.js", "path/./dot/./file.js", "path/../parent/../file.js",
  "trailing-space .js", "trailing-dot..js", " leading-space.js",
  "mixed/separators\\windows.js", "tab\tfile.js", "newline\nfile.js", "return\rfile.js",
  "file\u202Ereversed.js", "file\u200Frtl.js", "file\u200Eltr.js",
  ...(process.platform === "win32" ? ["CON.js", "PRN.txt", "AUX.js", "NUL.js", "COM1.js", "LPT1.js"] : []),
  "a".repeat(200) + ".js", "deep/" + "nested/".repeat(20) + "file.js"
];

const PATTERNS = [
  "*", "*.js", "*.ts", "*.css", "*.*", "f*", "*b", "file*", "*test*", "app*",
  "?", "?.js", "??.js", "???.js", "file?.txt", "?est.js", "a??.js", "?a?.js",
  "[abc].js", "[a-c].js", "[A-C].js", "[a-zA-Z].js", "[0-9].txt", "[1-3].txt", "file-[a-z].js", "test[0-9].js",
  "[!abc].js", "[!a-c].js", "[^abc].js", "[^a-c].js", "[!0-9].txt", "file-[!abc].js", "test[^123].js",
  "{js,ts}", "*.{js,ts,css}", "app.{js,ts}", "{app,config}.{js,json}", "{test,main}.{spec,test}.js",
  "file{1..3}.txt", "file{01..03}.txt", "{foo,bar,baz}.js",
  "**", "**/*", "**/*.js", "src/**/*.js", "lib/**/*.js", "**/components/*.js", "**/utils/*.js", "src/**/Button.js",
  "**/{components,utils}/*.js", "{src,lib}/**/*.js",
  ".*", ".git*", ".*rc", ".env*", "**/.hidden",
  "src/**/*.{js,ts}", "**/{test,spec}/**/*.js", "{src,lib}/**/*.{js,ts,jsx,tsx}",
  "**/*.{spec,test}.{js,ts}", "src/**/components/**/*.{jsx,tsx}",
  "файл.*", "文件.*", "🚀*", "*café*", "**/*файл*",
  "", ".", "..", "/", "\\", "**/", "/**", "///", "./././", "../../../",
  "file with spaces.*", "*with*spaces*", "file-*-test.*",
  "**/double//**", "path/./dot/*", "*/../parent/*", "*trailing-space *",
  "*\t*", "*\n*", "*\r*", "*\u202E*", "*\u200F*",
  "a".repeat(50) + "*", "*/" + "nested/".repeat(10) + "*",
  ...(process.platform === "win32" ? ["CON.*", "*.PRN", "[CP]*.js", "//server/share/*", "\\\\server\\share\\*"] : [])
];

const ABSOLUTE_PATTERNS = [
  resolve(FIXTURE_DIR, "*.js"),
  resolve(FIXTURE_DIR, "src", "**", "*.js"),
  resolve(FIXTURE_DIR, "**", "*.{js,ts}"),
  process.platform === "win32" ? "C:\\*.js" : "/tmp/*.js",
  process.platform === "win32" ? "D:\\nonexistent\\*.js" : "/nonexistent/*.js"
];

const OPTIONS_SETS = [
  {},
  { cwd: "." },
  { dot: true },
  { absolute: true },
  { filesOnly: true },
  { flush: true },
  { cwd: ".", dot: true },
  { cwd: ".", absolute: true },
  { cwd: ".", filesOnly: true },
  { dot: true, absolute: true },
  { dot: true, filesOnly: true },
  { absolute: true, filesOnly: true },
  { cwd: ".", dot: true, absolute: true },
  { cwd: ".", dot: true, filesOnly: true },
  { cwd: ".", absolute: true, filesOnly: true },
  { dot: true, absolute: true, filesOnly: true },
  { cwd: ".", dot: true, absolute: true, filesOnly: true },
  { cwd: ".", dot: true, absolute: true, filesOnly: true, flush: true }
];

async function setupFixtures() {
  await rm(FIXTURE_DIR, { recursive: true, force: true });

  for (const file of FILES) {
    try {
      const fullPath = join(FIXTURE_DIR, file);
      await mkdir(join(fullPath, ".."), { recursive: true });
      await writeFile(fullPath, "");
    } catch { /* ignore */ }
  }

  try {
    await mkdir(join(FIXTURE_DIR, "src"), { recursive: true });
    await writeFile(join(FIXTURE_DIR, "src/index.js"), "");

    await symlink("src/index.js", join(FIXTURE_DIR, "link-to-file.js"));
    await symlink("src", join(FIXTURE_DIR, "link-to-dir"));
    await symlink("nonexistent", join(FIXTURE_DIR, "broken-link"));

    for (let i = 1; i <= 10; i++) {
      const target = i === 10 ? "broken-target" : `chain-${i + 1}`;
      await symlink(target, join(FIXTURE_DIR, `chain-${i}`));
    }

    await symlink("cycle-b", join(FIXTURE_DIR, "cycle-a"));
    await symlink("cycle-a", join(FIXTURE_DIR, "cycle-b"));
  } catch { /* ignore */ }

  if (process.platform !== "win32") {
    try {
      await mkdir(join(FIXTURE_DIR, "perms"), { recursive: true });
      await writeFile(join(FIXTURE_DIR, "perms/normal.js"), "");
      await writeFile(join(FIXTURE_DIR, "perms/readonly.js"), "");
      await writeFile(join(FIXTURE_DIR, "perms/noread.js"), "");
      await chmod(join(FIXTURE_DIR, "perms/readonly.js"), 0o444);
      await chmod(join(FIXTURE_DIR, "perms/noread.js"), 0o000);

      await mkdir(join(FIXTURE_DIR, "dir-perms"), { recursive: true });
      await mkdir(join(FIXTURE_DIR, "dir-perms/normal"), { recursive: true });
      await mkdir(join(FIXTURE_DIR, "dir-perms/noread"), { recursive: true });
      await mkdir(join(FIXTURE_DIR, "dir-perms/noexec"), { recursive: true });
      await writeFile(join(FIXTURE_DIR, "dir-perms/noread/hidden.js"), "");
      await writeFile(join(FIXTURE_DIR, "dir-perms/noexec/blocked.js"), "");
      await chmod(join(FIXTURE_DIR, "dir-perms/noread"), 0o300);
      await chmod(join(FIXTURE_DIR, "dir-perms/noexec"), 0o600);
    } catch { /** ignore */}
  }
}

async function runTests() {
  await setupFixtures();

  try {
    console.log(styleText("bold", "=== RELATIVE PATTERNS ==="));
    for (const pattern of PATTERNS) {
      console.log(styleText("bold", `"${pattern}"`));

      for (const [i, options] of OPTIONS_SETS.entries()) {
        try {
          const results = await tinyGlob(`${FIXTURE_DIR}/${pattern}`, options);
          const normalized = results.map(path =>
            path.replace(/\\/g, '/').replace(new RegExp(`^${FIXTURE_DIR.replace(/\\/g, '/')}/`), '')
          ).sort();
          console.log(`  [${i}] (${results.length}): ${normalized.join(", ")}`);
        } catch (error) {
          console.log(`  [${i}] ERROR: ${String(error)}`);
        }
      }
      console.log("");
    }

    console.log(styleText("bold", "=== ABSOLUTE PATTERNS ==="));
    for (const pattern of ABSOLUTE_PATTERNS) {
      console.log(styleText("bold", `"${pattern}"`));

      for (const [i, options] of OPTIONS_SETS.entries()) {
        try {
          const results = await tinyGlob(pattern, options);
          const normalized = results.map(path =>
            path.replace(/\\/g, '/').replace(new RegExp(`^${FIXTURE_DIR.replace(/\\/g, '/')}/`), '')
          ).sort();
          console.log(`  [${i}] (${results.length}): ${normalized.join(", ")}`);
        } catch (error) {
          console.log(`  [${i}] ERROR: ${String(error)}`);
        }
      }
      console.log("");
    }

  } finally {
    try {
      if (process.platform !== "win32") {
        await chmod(join(FIXTURE_DIR, "perms/noread.js"), 0o644);
        await chmod(join(FIXTURE_DIR, "dir-perms/noread"), 0o755);
        await chmod(join(FIXTURE_DIR, "dir-perms/noexec"), 0o755);
      }
    } catch { /** ignore */}
    await rm(FIXTURE_DIR, { recursive: true, force: true });
  }
}

runTests().catch(console.error);
