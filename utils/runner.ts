import type { AnyGlobOptions } from "./options";

type LibraryName = "fast-glob" | "glob" | "globby" | "tiny-glob" | "tinyglobby";
type GlobRes = string | object;

interface GlobMod {
  default?: (pattern: string | string[], options?: any) => Promise<GlobRes[]>;
  glob?: (pattern: string | string[], options?: any) => Promise<GlobRes[]>;
  globby?: (pattern: string | string[], options?: any) => Promise<GlobRes[]>;
}

export async function getFiles(
  lib: LibraryName,
  mod: GlobMod,
  pattern: string | string[],
  opts: AnyGlobOptions = {},
): Promise<GlobRes[]> {
  const normOpts = normalizeOpts(lib, opts);

  let fn;
  switch (lib) {
    case "glob":
      fn = mod.glob;
      break;
    case "globby":
      fn = mod.globby;
      break;
    case "fast-glob":
      fn = mod.default;
      break;
    case "tiny-glob":
      fn = mod.default;
      break;
    case "tinyglobby":
      fn = mod.glob;
      break;
  }

  return await fn!(pattern, normOpts);
}

export function normalizeOpts(lib: LibraryName, opts: AnyGlobOptions): any {
  const res: any = {};

  if ("ignore" in opts && opts.ignore) res.ignore = opts.ignore;
  if ("absolute" in opts && opts.absolute) res.absolute = true;
  if ("dot" in opts && opts.dot) res.dot = true;
  if ("cwd" in opts && opts.cwd) res.cwd = opts.cwd;

  if ("gitignore" in opts && opts.gitignore && lib === "globby") {
    res.gitignore = true;
  }

  const caseSensitive =
    "caseSensitiveMatch" in opts
      ? opts.caseSensitiveMatch
      : "nocase" in opts
        ? !opts.nocase
        : undefined;
  if (caseSensitive !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.caseSensitiveMatch = caseSensitive;
    } else if (lib === "glob") {
      res.nocase = !caseSensitive;
    }
  }

  const depth =
    "deep" in opts ? opts.deep : "maxDepth" in opts ? opts.maxDepth : undefined;
  if (depth !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.deep = depth;
    } else if (lib === "glob") {
      res.maxDepth = depth;
    }
  }

  if (
    "onlyDirectories" in opts &&
    opts.onlyDirectories &&
    ["fast-glob", "globby", "tinyglobby"].includes(lib)
  ) {
    res.onlyDirectories = true;
  }

  if ("onlyFiles" in opts && opts.onlyFiles !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.onlyFiles = opts.onlyFiles;
    } else if (lib === "glob") {
      res.nodir = opts.onlyFiles;
    } else if (lib === "tiny-glob") {
      res.filesOnly = opts.onlyFiles;
    }
  }

  if ("filesOnly" in opts && opts.filesOnly && lib === "tiny-glob") {
    res.filesOnly = true;
  }

  const markDirs =
    "markDirectories" in opts
      ? opts.markDirectories
      : "mark" in opts
        ? opts.mark
        : undefined;
  if (markDirs) {
    if (["fast-glob", "globby"].includes(lib)) {
      res.markDirectories = true;
    } else if (lib === "glob") {
      res.mark = true;
    }
  }

  const objectMode =
    "objectMode" in opts
      ? opts.objectMode
      : "withFileTypes" in opts
        ? opts.withFileTypes
        : undefined;
  if (objectMode) {
    if (["fast-glob", "globby"].includes(lib)) {
      res.objectMode = true;
    } else if (lib === "glob") {
      res.withFileTypes = true;
    }
  }

  if ("stats" in opts && opts.stats && ["fast-glob", "globby"].includes(lib)) {
    res.stats = true;
  }

  const matchBase =
    "baseNameMatch" in opts
      ? opts.baseNameMatch
      : "matchBase" in opts
        ? opts.matchBase
        : undefined;
  if (matchBase !== undefined) {
    if (lib === "glob") {
      res.matchBase = matchBase;
    } else if (["fast-glob", "globby"].includes(lib)) {
      res.baseNameMatch = matchBase;
    }
  }

  const extglob =
    "extglob" in opts ? opts.extglob : "noext" in opts ? !opts.noext : true;
  if (extglob && ["glob", "fast-glob", "globby"].includes(lib)) {
    res.extglob = true;
  }

  const followSymlinks =
    "followSymbolicLinks" in opts
      ? opts.followSymbolicLinks
      : "follow" in opts
        ? opts.follow
        : undefined;
  if (followSymlinks !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(lib)) {
      res.followSymbolicLinks = followSymlinks;
    } else if (lib === "glob") {
      res.follow = followSymlinks;
    }
  }

  if (
    "braceExpansion" in opts &&
    opts.braceExpansion !== undefined &&
    ["fast-glob", "globby"].includes(lib)
  ) {
    res.braceExpansion = opts.braceExpansion;
  }

  if ("nobrace" in opts && opts.nobrace && lib === "glob") {
    res.nobrace = opts.nobrace;
  }

  if (
    "globstar" in opts &&
    opts.globstar !== undefined &&
    ["fast-glob", "globby"].includes(lib)
  ) {
    res.globstar = opts.globstar;
  }

  if ("noglobstar" in opts && opts.noglobstar && lib === "glob") {
    res.noglobstar = opts.noglobstar;
  }

  if (
    "unique" in opts &&
    opts.unique !== undefined &&
    ["fast-glob", "globby"].includes(lib)
  ) {
    res.unique = opts.unique;
  }

  if (
    "concurrency" in opts &&
    opts.concurrency &&
    ["fast-glob", "globby"].includes(lib)
  ) {
    res.concurrency = opts.concurrency;
  }

  if (
    "expandDirectories" in opts &&
    opts.expandDirectories !== undefined &&
    ["globby", "tinyglobby"].includes(lib)
  ) {
    res.expandDirectories = opts.expandDirectories;
  }

  if (lib === "globby" && "ignoreFiles" in opts && opts.ignoreFiles) {
    res.ignoreFiles = opts.ignoreFiles;
  }

  if (lib === "tinyglobby" && "debug" in opts && opts.debug) {
    res.debug = opts.debug;
  }

  if (lib === "tiny-glob" && "flush" in opts && opts.flush) {
    res.flush = opts.flush;
  }

  if (lib === "glob") {
    if ("root" in opts && opts.root) res.root = opts.root;
    if ("windowsPathsNoEscape" in opts && opts.windowsPathsNoEscape) {
      res.windowsPathsNoEscape = opts.windowsPathsNoEscape;
    }
    if ("magicalBraces" in opts && opts.magicalBraces) {
      res.magicalBraces = opts.magicalBraces;
    }
    if ("dotRelative" in opts && opts.dotRelative) {
      res.dotRelative = opts.dotRelative;
    }
    if ("realpath" in opts && opts.realpath) res.realpath = opts.realpath;
    if ("posix" in opts && opts.posix) res.posix = opts.posix;
    if ("platform" in opts && opts.platform) res.platform = opts.platform;
    if ("signal" in opts && opts.signal) res.signal = opts.signal;
    if (
      "includeChildMatches" in opts &&
      opts.includeChildMatches !== undefined
    ) {
      res.includeChildMatches = opts.includeChildMatches;
    }
    if ("stat" in opts && opts.stat) res.stat = opts.stat;
    if ("matchBase" in opts && opts.matchBase) res.matchBase = opts.matchBase;
    if ("nodir" in opts && opts.nodir) res.nodir = opts.nodir;
  }

  if (["fast-glob", "globby"].includes(lib)) {
    if ("suppressErrors" in opts && opts.suppressErrors) {
      res.suppressErrors = opts.suppressErrors;
    }
    if (
      "throwErrorOnBrokenSymbolicLink" in opts &&
      opts.throwErrorOnBrokenSymbolicLink
    ) {
      res.throwErrorOnBrokenSymbolicLink = opts.throwErrorOnBrokenSymbolicLink;
    }
    if ("fs" in opts && opts.fs) res.fs = opts.fs;
  }

  return res;
}
