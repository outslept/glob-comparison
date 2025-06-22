/**
 * Fast-glob specific options
 */
interface FastGlobOptions {
  /** Specifies the maximum number of concurrent requests from a reader to read directories */
  concurrency?: number;

  /** The current working directory in which to search */
  cwd?: string;

  /** Specifies the maximum depth of a read directory relative to the start directory */
  deep?: number;

  /** Indicates whether to traverse descendants of symbolic link directories when expanding ** patterns */
  followSymbolicLinks?: boolean;

  /** Custom implementation of methods for working with the file system */
  fs?: Record<string, unknown>;

  /** An array of glob patterns to exclude matches. This is an alternative way to use negative patterns */
  ignore?: string[];

  /** By default this package suppress only ENOENT errors. Set to true to suppress any error */
  suppressErrors?: boolean;

  /** Throw an error when symbolic link is broken if true or safely return lstat call if false */
  throwErrorOnBrokenSymbolicLink?: boolean;

  /** Return the absolute path for entries */
  absolute?: boolean;

  /** Mark the directory path with the final slash */
  markDirectories?: boolean;

  /** Returns objects (instead of strings) describing entries */
  objectMode?: boolean;

  /** Return only directories */
  onlyDirectories?: boolean;

  /** Return only files */
  onlyFiles?: boolean;

  /** Enables an object mode with an additional field: stats (fs.Stats) — instance of fs.Stats */
  stats?: boolean;

  /** Ensures that the returned entries are unique */
  unique?: boolean;

  /** Enables Bash-like brace expansion */
  braceExpansion?: boolean;

  /** Enables a case-sensitive mode for matching files */
  caseSensitiveMatch?: boolean;

  /** Allow patterns to match entries that begin with a period (.) */
  dot?: boolean;

  /** Enables Bash-like extglob functionality */
  extglob?: boolean;

  /** Enables recursively repeats a pattern containing **. If false, ** behaves exactly like * */
  globstar?: boolean;

  /** If set to true, then patterns without slashes will be matched against the basename of the path if it contains slashes */
  baseNameMatch?: boolean;
}

/**
 * Globby specific options (extends fast-glob options)
 */
interface GlobbyOptions extends FastGlobOptions {
  /** If set to true, globby will automatically glob directories for you */
  expandDirectories?:
    | boolean
    | string[]
    | { files?: string[]; extensions?: string[] };

  /** Respect ignore patterns in .gitignore files that apply to the globbed files */
  gitignore?: boolean;

  /** Glob patterns to look for ignore files, which are then used to ignore globbed files */
  ignoreFiles?: string | string[];
}

/**
 * Tiny-glob specific options
 */
interface TinyGlobOptions {
  /** Change default working directory */
  cwd?: string;

  /** Allow patterns to match filenames or directories that begin with a period (.) */
  dot?: boolean;

  /** Return matches as absolute paths */
  absolute?: boolean;

  /** Skip directories and return matched files only */
  filesOnly?: boolean;

  /** Flush the internal cache object */
  flush?: boolean;
}

/**
 * Tinyglobby specific options
 */
interface TinyglobbyOptions {
  /** An array of glob patterns to ignore */
  ignore?: string[];

  /** The current working directory in which to search. Defaults to process.cwd() */
  cwd?: string;

  /** Whether to return absolute paths. Defaults to false */
  absolute?: boolean;

  /** Whether to allow entries starting with a dot. Defaults to false */
  dot?: boolean;

  /** Maximum depth of a directory. Defaults to Infinity */
  deep?: number;

  /** Whether to traverse and include symbolic links. Defaults to true */
  followSymbolicLinks?: boolean;

  /** Whether to match in case-sensitive mode. Defaults to true */
  caseSensitiveMatch?: boolean;

  /** Whether to expand directories. Disable to best match fast-glob. Defaults to true */
  expandDirectories?: boolean;

  /** Enable to only return directories. Disables onlyFiles if set. Defaults to false */
  onlyDirectories?: boolean;

  /** Enable to only return files. Defaults to true */
  onlyFiles?: boolean;

  /** Enable debug logs. Useful for development purposes */
  debug?: boolean;
}

/**
 * Glob (node-glob) specific options
 */
interface GlobOptions {
  /** String path or file:// string or URL object. The current working directory in which to search. Defaults to process.cwd() */
  cwd?: string;

  /** A string path resolved against the cwd option, which is used as the starting point for absolute patterns that start with / */
  root?: string;

  /** Use \\ as a path separator only, and never as an escape character. If set, all \\ characters are replaced with / in the pattern */
  windowsPathsNoEscape?: boolean;

  /** Include .dot files in normal matches and globstar matches. Note that an explicit dot in a portion of the pattern will always match dot files */
  dot?: boolean;

  /** Treat brace expansion like {a,b} as a "magic" pattern. Has no effect if nobrace is set */
  magicalBraces?: boolean;

  /** Prepend all relative path strings with ./ (or .\ on Windows) */
  dotRelative?: boolean;

  /** Add a / character to directory matches. Note that this requires additional stat calls */
  mark?: boolean;

  /** Do not expand {a,b} and {1..3} brace sets */
  nobrace?: boolean;

  /** Do not match ** against multiple filenames. (Ie, treat it as a normal * instead.) */
  noglobstar?: boolean;

  /** Do not match "extglob" patterns such as +(a|b) */
  noext?: boolean;

  /** Perform a case-insensitive match. This defaults to true on macOS and Windows systems, and false on all others */
  nocase?: boolean;

  /** Specify a number to limit the depth of the directory traversal to this many levels below the cwd */
  maxDepth?: number;

  /** Perform a basename-only match if the pattern does not contain any slash characters. That is, *.js would be treated as equivalent to **\/*.js, matching all js files in all directories */
  matchBase?: boolean;

  /** Do not match directories, only files. (Note: to match only directories, put a / at the end of the pattern.) */
  nodir?: boolean;

  /** Call lstat() on all entries, whether required or not to determine whether it's a valid match */
  stat?: boolean;

  /** string or string[], or an object with ignored and childrenIgnored methods */
  ignore?:
    | string
    | string[]
    | {
        ignored?: (path: any) => boolean;
        childrenIgnored?: (path: any) => boolean;
      };

  /** Follow symlinked directories when expanding ** patterns */
  follow?: boolean;

  /** Set to true to call fs.realpath on all of the results. In the case of an entry that cannot be resolved, the entry is omitted */
  realpath?: boolean;

  /** Set to true to always receive absolute paths for matched files. Set to false to always receive relative paths for matched files */
  absolute?: boolean;

  /** Set to true to use / as the path separator in returned results */
  posix?: boolean;

  /** Defaults to value of process.platform if available, or 'linux' if not. Setting platform:'win32' on non-Windows systems may cause strange behavior */
  platform?: string;

  /** Return PathScurry Path objects instead of strings. These are similar to a NodeJS Dirent object, but with additional methods and properties */
  withFileTypes?: boolean;

  /** An AbortSignal which will cancel the Glob walk when triggered */
  signal?: AbortSignal;

  /** An override object to pass in custom filesystem methods */
  fs?: Record<string, unknown>;

  /** A PathScurry object used to traverse the file system. If the nocase option is set explicitly, then any provided scurry object must match this setting */
  scurry?: unknown;

  /** Do not match any children of any matches. For example, the pattern **\/foo would match a/foo, but not a/foo/b/foo in this mode */
  includeChildMatches?: boolean;
}

export type AnyGlobOptions =
  | FastGlobOptions
  | GlobbyOptions
  | TinyGlobOptions
  | TinyglobbyOptions
  | GlobOptions;
