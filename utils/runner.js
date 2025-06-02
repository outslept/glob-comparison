export async function getFiles(libName, module, pattern, options = {}) {
  const opts = normalizeOptions(libName, options);

  switch (libName) {
    case "fast-glob":
      return await module.default(pattern, opts);
    case "glob":
      return await module.glob(pattern, opts);
    case "globby":
      return await module.globby(pattern, opts);
    case "tiny-glob":
      return await module.default(pattern, opts);
    case "tinyglobby":
      return await module.glob(pattern, opts);
    default:
      return [];
  }
}

export function normalizeOptions(libName, options) {
  const opts = {};

  if (options.ignore) opts.ignore = options.ignore;
  if (options.gitignore && libName === "globby") opts.gitignore = true;
  if (options.absolute) opts.absolute = true;
  if (options.dot) opts.dot = true;

  if (options.caseSensitive !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(libName)) {
      opts.caseSensitiveMatch = options.caseSensitive;
    } else if (libName === "glob") {
      opts.nocase = !options.caseSensitive;
    }
  }

  if (options.depth !== undefined) {
    if (["fast-glob", "globby", "tinyglobby"].includes(libName)) {
      opts.deep = options.depth;
    } else if (libName === "glob") {
      opts.maxDepth = options.depth;
    }
  }

  if (
    options.onlyDirectories &&
    ["fast-glob", "tinyglobby"].includes(libName)
  ) {
    opts.onlyDirectories = true;
  }

  if (
    options.onlyFiles !== undefined &&
    ["fast-glob", "globby", "tinyglobby"].includes(libName)
  ) {
    opts.onlyFiles = options.onlyFiles;
  }

  if (options.markDirectories) {
    if (["fast-glob", "tinyglobby"].includes(libName)) {
      opts.markDirectories = true;
    } else if (libName === "glob") {
      opts.mark = true;
    }
  }

  if (options.objectMode) {
    if (["fast-glob", "tinyglobby"].includes(libName)) {
      opts.objectMode = true;
    } else if (libName === "glob") {
      opts.withFileTypes = true;
    }
  }

  if (options.extglob !== false && libName === "glob") {
    opts.extglob = true;
  }

  return opts;
}
