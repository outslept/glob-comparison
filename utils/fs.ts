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
  symlinks?: {
    from: string;
    to: string;
    type?: "file" | "dir" | "junction";
  }[];
  hiddenFiles?: string[];
  platformSpecific?: "linux" | "win32";
  needsSymlinks?: boolean;
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

  const testDir = mkdtempSync(join(tmpdir(), "symlink-test-"));
  try {
    const testFile = join(testDir, "test.txt");
    const testLink = join(testDir, "test-link.txt");

    writeFileSync(testFile, "test");
    symlinkSync(testFile, testLink, "file");
    return true;
  } catch {
    return false;
  } finally {
    rmSync(testDir, { recursive: true, force: true });
  }
}

export function createTestEnv(cfg: TestConfig): TestEnvResult | TestEnvSuccess {
  if (cfg.platformSpecific && cfg.platformSpecific !== process.platform) {
    return { skip: true, reason: `${cfg.platformSpecific} only` };
  }

  const hasSymlinks = cfg.symlinks && cfg.symlinks.length > 0;
  if ((cfg.needsSymlinks || hasSymlinks) && !canCreateSymlinks()) {
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

  const uniqueFileDirs = new Set(cfg.files.map((file) => dirname(file)));

  uniqueFileDirs.forEach((dir) => {
    if (dir !== ".") {
      mkdirSync(join(testDir, dir), { recursive: true });
    }
  });

  cfg.files.forEach((file) => {
    const path = join(testDir, file);
    writeFileSync(path, "");
  });

  if (hasSymlinks) {
    try {
      cfg.symlinks?.forEach((link) => {
        const target = join(testDir, link.from);
        const path = join(testDir, link.to);
        mkdirSync(dirname(path), { recursive: true });
        symlinkSync(target, path, link.type);
      });
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
