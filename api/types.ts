export interface TestConfig {
  files: string[];
  directories?: string[];
  symlinks?: {
    from: string;
    to: string;
    type?: "file" | "dir" | "junction";
  }[];
  hiddenFiles?: string[];
  platformSpecific?: "linux" | "win32";
  needsSymlinks?: boolean;
}

export interface TestCase {
  name: string;
  fn: () => Promise<void> | void;
  type: "test";
  skip: boolean;
  only: boolean;
}

export interface TestSuite {
  name: string;
  type: "describe";
  tests: (TestCase | TestSuite)[];
  hooks: {
    beforeEach: (() => Promise<void> | void)[];
    afterEach: (() => Promise<void> | void)[];
    beforeAll: (() => Promise<void> | void)[];
    afterAll: (() => Promise<void> | void)[];
  };
}

export interface TestStats {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
}

export type LibraryName =
  | "fast-glob"
  | "glob"
  | "globby"
  | "tiny-glob"
  | "tinyglobby";
export type GlobResult = string | object;
