import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export function createTestEnvironment(testConfig) {
  const { testName, files, directories = [] } = testConfig;
  const tempDir = join(tmpdir(), `glob-test-${Date.now()}`);
  const testDir = join(tempDir, "test");

  mkdirSync(testDir, { recursive: true });

  directories.forEach((dirPath) =>
    mkdirSync(join(testDir, dirPath), { recursive: true }),
  );

  files.forEach((fileName) => {
    const filePath = join(testDir, fileName);
    const dir = dirname(filePath);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, "");
  });

  if (testName === "Gitignore Support") {
    writeFileSync(join(testDir, ".gitignore"), "*.tmp\nignored.txt\n");
  }

  return { tempDir, testDir };
}

export function cleanupTestEnvironment(tempDir) {
  rmSync(tempDir, { recursive: true, force: true });
}
