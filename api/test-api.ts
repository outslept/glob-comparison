/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import process from "node:process";
import { cleanupTestEnv, createTestEnv } from "../utils/fs.js";
import { getFiles } from "../utils/runner.js";
import type { AnyGlobOptions } from "../utils/options.js";
import type {
  GlobResult,
  LibraryName,
  TestCase,
  TestConfig,
  TestSuite,
} from "./types.js";

declare global {
  var __currentSuite: TestSuite | undefined;
  var __testSuites: TestSuite[];
}

export class TestContext {
  private tempDir: string | null = null;
  private testDir: string | null = null;
  private originalCwd: string | null = null;

  constructor(
    public readonly name: string,
    public readonly config: TestConfig,
  ) {}

  setup(): void {
    const envResult = createTestEnv(this.config);

    if ("skip" in envResult) {
      throw new TestSkipError(envResult.reason);
    }

    this.tempDir = envResult.tempDir;
    this.testDir = envResult.testDir;
    this.originalCwd = process.cwd();
    process.chdir(this.testDir);
  }

  cleanup(): void {
    if (this.originalCwd) process.chdir(this.originalCwd);
    if (this.tempDir) cleanupTestEnv(this.tempDir);
  }

  async glob(
    library: LibraryName,
    pattern: string | string[],
    options: AnyGlobOptions = {},
  ): Promise<GlobResult[]> {
    try {
      const module = await import(library);
      return await getFiles(library, module, pattern, options);
    } catch (error) {
      throw new GlobError(
        library,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  async globAll(
    libraries: LibraryName[],
    pattern: string | string[],
    options: AnyGlobOptions = {},
  ): Promise<Map<LibraryName, GlobResult[] | { error: string }>> {
    const results = new Map<LibraryName, GlobResult[] | { error: string }>();

    for (const library of libraries) {
      try {
        results.set(library, await this.glob(library, pattern, options));
      } catch (error) {
        results.set(library, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return results;
  }
}

export class TestSkipError extends Error {
  public readonly skip = true;

  constructor(reason: string) {
    super(`Test skipped: ${reason}`);
    this.name = "TestSkipError";
  }
}

export class GlobError extends Error {
  constructor(
    public readonly library: LibraryName,
    message: string,
  ) {
    super(`${library}: ${message}`);
    this.name = "GlobError";
  }
}

export function describe(name: string, fn: () => void): TestSuite {
  const suite: TestSuite = {
    name,
    type: "describe",
    tests: [],
    hooks: {
      beforeEach: [],
      afterEach: [],
      beforeAll: [],
      afterAll: [],
    },
  };

  const previousSuite = globalThis.__currentSuite;
  globalThis.__currentSuite = suite;

  try {
    fn();
  } finally {
    globalThis.__currentSuite = previousSuite;
  }

  if (previousSuite) {
    previousSuite.tests.push(suite);
  } else {
    globalThis.__testSuites = globalThis.__testSuites || [];
    globalThis.__testSuites.push(suite);
  }

  return suite;
}

export function test(name: string, fn: () => Promise<void> | void): TestCase {
  const testCase: TestCase = {
    name,
    fn,
    type: "test",
    skip: false,
    only: false,
  };

  if (globalThis.__currentSuite) {
    globalThis.__currentSuite.tests.push(testCase);
  }

  return testCase;
}

export const it = test;

export function skip(name: string, fn: () => Promise<void> | void): TestCase {
  const testCase = test(name, fn);
  testCase.skip = true;
  return testCase;
}

export function only(name: string, fn: () => Promise<void> | void): TestCase {
  const testCase = test(name, fn);
  testCase.only = true;
  return testCase;
}

export function beforeEach(fn: () => Promise<void> | void): void {
  globalThis.__currentSuite?.hooks.beforeEach.push(fn);
}

export function afterEach(fn: () => Promise<void> | void): void {
  globalThis.__currentSuite?.hooks.afterEach.push(fn);
}

export function beforeAll(fn: () => Promise<void> | void): void {
  globalThis.__currentSuite?.hooks.beforeAll.push(fn);
}

export function afterAll(fn: () => Promise<void> | void): void {
  globalThis.__currentSuite?.hooks.afterAll.push(fn);
}

export function withFiles(
  files: string[],
  directories: string[] = [],
): TestConfig {
  return {
    files,
    directories,
    symlinks: [],
    hiddenFiles: [],
  };
}

export function withSymlinks(symlinks: TestConfig["symlinks"]) {
  return (config: TestConfig): TestConfig => ({
    ...config,
    symlinks,
    needsSymlinks: true,
  });
}

export function withHiddenFiles(hiddenFiles: string[]) {
  return (config: TestConfig): TestConfig => ({
    ...config,
    hiddenFiles,
  });
}

export function platformOnly(platform: "linux" | "win32") {
  return (config: TestConfig): TestConfig => ({
    ...config,
    platformSpecific: platform,
  });
}
