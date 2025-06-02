/**
 * @typedef {object} GlobOptions
 * @property {string[]} [ignore] - Patterns to ignore
 * @property {boolean} [gitignore] - Respect .gitignore files (globby only)
 * @property {boolean} [absolute] - Return absolute paths
 * @property {boolean} [dot] - Include dotfiles
 * @property {boolean} [caseSensitive] - Enable case-sensitive matching
 * @property {number} [depth] - Maximum directory depth to traverse
 * @property {boolean} [onlyDirectories] - Return only directories
 * @property {boolean} [onlyFiles] - Return only files
 * @property {boolean} [markDirectories] - Mark directories with trailing slash
 * @property {boolean} [objectMode] - Return file objects instead of strings
 * @property {boolean} [extglob] - Enable extended glob patterns
 */

/**
 * @typedef {object} GlobModule
 * @property {Function} [default] - Default export function
 * @property {Function} [glob] - Named glob function
 * @property {Function} [globby] - Named globby function
 */

/**
 * @typedef {string | object} GlobResult
 * Result can be a file path string or file object depending on objectMode option
 */

/**
 * @param {string} libName - Library name ('fast-glob', 'glob', 'globby', 'tiny-glob', 'tinyglobby')
 * @param {GlobModule} module - Imported glob library module
 * @param {string|string[]} pattern - Glob pattern(s) to match
 * @param {GlobOptions} [options] - Glob options
 * @returns {Promise<GlobResult[]>} Array of matched file paths or file objects
 */
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

/**
 * @param {string} libName - Library name ('fast-glob', 'glob', 'globby', 'tiny-glob', 'tinyglobby')
 * @param {GlobOptions} options - Input options object
 * @returns {object} Normalized options object for the specific library
 */
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
