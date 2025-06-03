import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import process from "node:process";

interface TestConfig {
  files: string[];
  dirs?: string[];
  platformSpecific?: NodeJS.Platform;
  needsSymlinks?: boolean;
  hiddenFiles?: string[];
}

interface TestEnvResult {
  skip: true;
  reason: string;
}

interface TestEnvSuccess {
  tempDir: string;
  testDir: string;
}

function canCreateSymlinks(): boolean {
  if (process.platform !== "win32") return true;

  try {
    const testDir = mkdtempSync(join(tmpdir(), "symlink-test-"));

    const testFile = join(testDir, "test.txt");
    const testLink = join(testDir, "test-link.txt");

    writeFileSync(testFile, "test");
    symlinkSync(testFile, testLink, "file");

    rmSync(testDir, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}

export function createTestEnv(cfg: TestConfig): TestEnvResult | TestEnvSuccess {
  if (cfg.platformSpecific && cfg.platformSpecific !== process.platform) {
    return { skip: true, reason: `${cfg.platformSpecific} only` };
  }

  if (cfg.needsSymlinks && !canCreateSymlinks()) {
    return {
      skip: true,
      reason:
        "Symlinks not available (run as admin on Windows or enable Developer Mode)",
    };
  }

  const tempDir = mkdtempSync(join(tmpdir(), "glob-test-"));
  const testDir = join(tempDir, "test");

  mkdirSync(testDir, { recursive: true });

  (cfg.dirs || []).forEach((dir) =>
    mkdirSync(join(testDir, dir), { recursive: true }),
  );

  cfg.files.forEach((file) => {
    const path = join(testDir, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, "");
  });

  if (cfg.needsSymlinks) {
    try {
      const symlinkType = process.platform === "win32" ? "file" : undefined;

      symlinkSync(
        join(testDir, "foo/real.js"),
        join(testDir, "foo/link.js"),
        symlinkType,
      );
      symlinkSync(
        join(testDir, "target.txt"),
        join(testDir, "bar/link-target.txt"),
        symlinkType,
      );
      symlinkSync(join(testDir, "foo"), join(testDir, "baz"), "dir");
    } catch (error) {
      rmSync(tempDir, { recursive: true, force: true });
      return {
        skip: true,
        reason: `Symlink creation failed: ${(error as Error).message}`,
      };
    }
  }

  if (cfg.hiddenFiles && process.platform === "win32") {
    try {
      cfg.hiddenFiles.forEach((file) => {
        const result = spawnSync("attrib", ["+H", join(testDir, file)], {
          stdio: "ignore",
          windowsHide: true,
        });
        if (result.status !== 0) {
          throw new Error(`attrib command failed with status ${result.status}`);
        }
      });
    } catch (error) {
      console.warn("Failed to mark files as hidden:", (error as Error).message);
    }
  }

  return { tempDir, testDir };
}

export function cleanupTestEnv(tempDir: string): void {
  rmSync(tempDir, { recursive: true, force: true });
}
