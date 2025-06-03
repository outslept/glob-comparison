interface GlobOpts {
  ignore?: string[];
  absolute?: boolean;
  dot?: boolean;
  cwd?: string;
  root?: string;
  windowsPathsNoEscape?: boolean;
  magicalBraces?: boolean;
  dotRelative?: boolean;
  mark?: boolean;
  nobrace?: boolean;
  noglobstar?: boolean;
  noext?: boolean;
  nocase?: boolean;
  maxDepth?: number;
  matchBase?: boolean;
  nodir?: boolean;
  stat?: boolean;
  follow?: boolean;
  realpath?: boolean;
  posix?: boolean;
  platform?: NodeJS.Platform;
  withFileTypes?: boolean;
  signal?: AbortSignal;
  includeChildMatches?: boolean;
  caseSensitive?: boolean;
  depth?: number;
  onlyDirectories?: boolean;
  onlyFiles?: boolean;
  markDirectories?: boolean;
  objectMode?: boolean;
  extglob?: boolean;
  followSymbolicLinks?: boolean;
  gitignore?: boolean;
}

interface FastGlobOpts {
  ignore?: string[];
  absolute?: boolean;
  dot?: boolean;
  cwd?: string;
  concurrency?: number;
  deep?: number;
  followSymbolicLinks?: boolean;
  fs?: Record<string, unknown>;
  suppressErrors?: boolean;
  throwErrorOnBrokenSymbolicLink?: boolean;
  markDirectories?: boolean;
  objectMode?: boolean;
  onlyDirectories?: boolean;
  onlyFiles?: boolean;
  stats?: boolean;
  unique?: boolean;
  braceExpansion?: boolean;
  caseSensitiveMatch?: boolean;
  extglob?: boolean;
  globstar?: boolean;
  baseNameMatch?: boolean;
}

interface GlobbyOpts {
  ignore?: string[];
  absolute?: boolean;
  dot?: boolean;
  cwd?: string;
  concurrency?: number;
  deep?: number;
  followSymbolicLinks?: boolean;
  fs?: Record<string, unknown>;
  suppressErrors?: boolean;
  throwErrorOnBrokenSymbolicLink?: boolean;
  markDirectories?: boolean;
  objectMode?: boolean;
  onlyDirectories?: boolean;
  onlyFiles?: boolean;
  stats?: boolean;
  unique?: boolean;
  braceExpansion?: boolean;
  caseSensitiveMatch?: boolean;
  extglob?: boolean;
  globstar?: boolean;
  baseNameMatch?: boolean;
  expandDirectories?:
    | boolean
    | string[]
    | { files?: string[]; extensions?: string[] };
  gitignore?: boolean;
  ignoreFiles?: string | string[];
}

interface TinyGlobOpts {
  absolute?: boolean;
  dot?: boolean;
  cwd?: string;
  filesOnly?: boolean;
  flush?: boolean;
}

interface TinyGlobbyOpts {
  ignore?: string[];
  absolute?: boolean;
  dot?: boolean;
  cwd?: string;
  deep?: number;
  followSymbolicLinks?: boolean;
  caseSensitiveMatch?: boolean;
  expandDirectories?: boolean;
  onlyDirectories?: boolean;
  onlyFiles?: boolean;
  debug?: boolean;
}

type LibraryName = "fast-glob" | "glob" | "globby" | "tiny-glob" | "tinyglobby";
type GlobRes = string | object;
type AnyOpts =
  | GlobOpts
  | FastGlobOpts
  | GlobbyOpts
  | TinyGlobOpts
  | TinyGlobbyOpts;

interface GlobMod {
  default?: (pattern: string | string[], options?: any) => Promise<GlobRes[]>;
  glob?: (pattern: string | string[], options?: any) => Promise<GlobRes[]>;
  globby?: (pattern: string | string[], options?: any) => Promise<GlobRes[]>;
}

export async function getFiles(
  lib: LibraryName,
  mod: GlobMod,
  pattern: string | string[],
  opts: AnyOpts = {},
): Promise<GlobRes[]> {
  const normOpts = normalizeOpts(lib, opts);

  const fn =
    lib === "glob" ? mod.glob : lib === "globby" ? mod.globby : mod.default;

  return await fn!(pattern, normOpts);
}

export function normalizeOpts(lib: LibraryName, opts: any): any {
  const res: any = {};

  if (opts.ignore) res.ignore = opts.ignore;
  if (opts.absolute) res.absolute = true;
  if (opts.dot) res.dot = true;
  if (opts.cwd) res.cwd = opts.cwd;
  if (opts.gitignore && lib === "globby") res.gitignore = true;

  const caseSensitive = opts.caseSensitive ?? opts.caseSensitiveMatch;
  if (caseSensitive !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.caseSensitiveMatch = caseSensitive;
    } else if (lib === "glob") {
      res.nocase = !caseSensitive;
    }
  }

  const depth = opts.depth ?? opts.deep ?? opts.maxDepth;
  if (depth !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.deep = depth;
    } else if (lib === "glob") {
      res.maxDepth = depth;
    }
  }

  if (opts.onlyDirectories && ["fast-glob", "tinyglobby"].includes(lib)) {
    res.onlyDirectories = true;
  }

  if (opts.onlyFiles !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.onlyFiles = opts.onlyFiles;
    } else if (lib === "glob") {
      res.nodir = opts.onlyFiles;
    } else if (lib === "tiny-glob") {
      res.filesOnly = opts.onlyFiles;
    }
  }

  const markDirs = opts.markDirectories ?? opts.mark;
  if (markDirs) {
    if (["fast-glob", "tinyglobby"].includes(lib)) {
      res.markDirectories = true;
    } else if (lib === "glob") {
      res.mark = true;
    }
  }

  const objectMode = opts.objectMode ?? opts.withFileTypes;
  if (objectMode) {
    if (["fast-glob", "tinyglobby"].includes(lib)) {
      res.objectMode = true;
    } else if (lib === "glob") {
      res.withFileTypes = true;
    }
  }

  if (opts.stats && ["fast-glob", "glob"].includes(lib)) res.stats = true;

  const matchBase = opts.matchBase ?? opts.baseNameMatch;
  if (matchBase !== undefined) {
    if (lib === "glob") {
      res.matchBase = matchBase;
    } else if (lib === "fast-glob") {
      res.baseNameMatch = matchBase;
    }
  }

  if (
    opts.extglob !== false &&
    opts.noext !== true &&
    ["glob", "fast-glob", "globby"].includes(lib)
  ) {
    res.extglob = true;
  }

  const followSymlinks = opts.followSymbolicLinks ?? opts.follow;
  if (followSymlinks !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.followSymbolicLinks = followSymlinks;
    } else if (lib === "glob") {
      res.follow = followSymlinks;
    }
  }

  if (
    opts.braceExpansion !== undefined &&
    ["fast-glob", "globby"].includes(lib)
  ) {
    res.braceExpansion = opts.braceExpansion;
  }
  if (opts.nobrace && lib === "glob") res.nobrace = opts.nobrace;

  if (opts.globstar !== undefined && ["fast-glob", "globby"].includes(lib)) {
    res.globstar = opts.globstar;
  }
  if (opts.noglobstar && lib === "glob") res.noglobstar = opts.noglobstar;

  if (opts.unique !== undefined && ["fast-glob", "globby"].includes(lib)) {
    res.unique = opts.unique;
  }

  if (opts.concurrency && ["fast-glob", "globby"].includes(lib)) {
    res.concurrency = opts.concurrency;
  }

  if (
    opts.expandDirectories !== undefined &&
    ["globby", "tinyglobby"].includes(lib)
  ) {
    res.expandDirectories = opts.expandDirectories;
  }

  if (opts.ignoreFiles && lib === "globby") res.ignoreFiles = opts.ignoreFiles;
  if (opts.debug && lib === "tinyglobby") res.debug = opts.debug;
  if (opts.flush && lib === "tiny-glob") res.flush = opts.flush;

  if (lib === "glob") {
    if (opts.root) res.root = opts.root;
    if (opts.windowsPathsNoEscape)
      res.windowsPathsNoEscape = opts.windowsPathsNoEscape;
    if (opts.magicalBraces) res.magicalBraces = opts.magicalBraces;
    if (opts.dotRelative) res.dotRelative = opts.dotRelative;
    if (opts.nocase) res.nocase = opts.nocase;
    if (opts.realpath) res.realpath = opts.realpath;
    if (opts.posix) res.posix = opts.posix;
    if (opts.platform) res.platform = opts.platform;
    if (opts.signal) res.signal = opts.signal;
    if (opts.includeChildMatches !== undefined)
      res.includeChildMatches = opts.includeChildMatches;
  }

  if (["fast-glob", "globby"].includes(lib)) {
    if (opts.suppressErrors) res.suppressErrors = opts.suppressErrors;
    if (opts.throwErrorOnBrokenSymbolicLink)
      res.throwErrorOnBrokenSymbolicLink = opts.throwErrorOnBrokenSymbolicLink;
    if (opts.fs) res.fs = opts.fs;
  }

  return res;
}
