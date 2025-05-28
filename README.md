# Feature Comparison

| Feature                                             | [fast-glob] | [glob] | [globby] | [tiny-glob] | [tinyglobby] | Note                                                                                                                                                  |
| --------------------------------------------------- | ----------- | ------ | -------- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic Patterns**                                  |
| [Asterisk] (`*`)                                    | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| [Question mark] (`?`)                               | Y           | Y      | Y        | N           | Y            | tiny-glob: globalyzer (subdep) doesn't recognize `?` as glob pattern [1]                                                                              |
| [Character classes] (`[abc]`)                       | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| [Character ranges] (`[a-z]`)                        | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| [Negated classes] (`[!abc]`)                        | Y           | Y      | Y        | Y           | N            | tinyglobby: returns inverted results for negated character classes [2]; glob: results in indeterminate order, manual sorting required |
| **Globstar**                                        |
| [Globstar] (`**`)                                   | Y           | Y      | Y        | Y           | Y            | glob, tiny-glob: results in indeterminate order, manual sorting required; glob: uses backslashes on Windows                           |
| Nested globstar (`src/**/*.js`)                     | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| Mixed globstar (`**/components/*.js`)               | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| **Brace Expansion**                                 |
| [Brace expansion] (`{js,ts}`)                       | Y           | Y      | Y        | Y           | Y            | glob, tiny-glob, tinyglobby: does not sort results                                                                                                    |
| Nested brace expansion (`*.{spec,test}.js`)         | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| Multiple brace expansion (`{app,config}.{js,json}`) | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| Simple numeric range (`{1..3}`)                     | Y           | Y      | Y        | N           | Y            | tiny-glob: returns empty results for all numeric ranges [3]; glob: results in indeterminate order, manual sorting required            |
| Zero-padded range (`{01..02}`)                      | Y           | Y      | Y        | N           | N            | tiny-glob: no support; tinyglobby: fails on zero-padded patterns [4]                                                                                  |
| [Plus] (`+(pattern)`)                               | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| [Question] (`?(pattern)`)                           | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| [Asterisk] (`*(pattern)`)                           | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| [At] (`@(pattern)`)                                 | Y           | Y      | Y        | Y           | Y            | glob: results in indeterminate order, manual sorting required                                                                         |
| [Exclamation] (`!(pattern)`)                        | Y           | Y      | N        | Y           | Y            | globby: treats extglob negation as negative patterns [5]; glob: results in indeterminate order, manual sorting required               |
| **Pattern Support**                                 |
| Single pattern (string)                             | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| Multiple patterns (array)                           | Y           | Y      | Y        | N           | Y            | tiny-glob: array support missing [6]                                                                                                                  |
| Basename matching (`matchBase: true`)               | Y           | Y      | Y        | N           | N            | tiny-glob, tinyglobby: no basename matching support [7]                                                                                               |
| **Pattern Arrays**                                  |
| Negation patterns (`['*.js', '!ignore.js']`)        | Y           | N      | Y        | N           | Y            | glob: ignores negation; tiny-glob: no array support [6]                                                                                               |
| Mixed positive/negative patterns                    | Y           | N      | Y        | N           | Y            | glob: ignores negation; tiny-glob: array error [6]                                                                                                    |
| **Ignore Options**                                  |
| Basic ignore patterns (`ignore: ['*.tmp']`)         | Y           | Y      | Y        | N           | Y            | tiny-glob: ignores the ignore option entirely [8]                                                                                                     |
| Negated ignore patterns (`ignore: ['!pattern']`)    | N           | N      | Y        | N           | N            | tinyglobby: returns empty results; fast-glob: silently ignores [9]                                                                                    |
| Gitignore support (`gitignore: true`)               | N           | N      | Y        | N           | N            | Only globby reads and applies .gitignore files [10]                                                                                                   |
| Custom ignore files (`ignoreFiles: ['.custom']`)    | N           | N      | Y        | N           | N            | Only globby supports custom ignore file reading [11]                                                                                                  |
| Multiple ignore files                               | N           | N      | Y        | N           | N            | Only globby can combine multiple ignore files [11]                                                                                                    |
| **Output Options**                                  |
| Absolute paths (`absolute: true`)                   | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| Case sensitivity control                            | Y           | Y      | Y        | Y           | N            | tinyglobby: case sensitive mode issues [12]                                                                                                           |
| Depth limiting (`deep`/`maxDepth`)                  | Y           | Y      | Y        | N           | Y            | tiny-glob: ignores depth options [13]                                                                                                                 |
| Directories only (`onlyDirectories: true`)          | Y           | N      | Y        | N           | Y            | glob, tiny-glob: ignore directory filtering [14]                                                                                                      |
| Files only (`onlyFiles: true`)                      | Y           | N      | Y        | N           | Y            | glob, tiny-glob: ignore file filtering [14]                                                                                                           |
| Both files and directories                          | Y           | N      | Y        | N           | Y            | glob, tiny-glob: no type filtering support [14]                                                                                                       |
| Mark directories (`markDirectories: true`)          | Y           | N      | Y        | N           | Y            | glob, tiny-glob: no directory marking [15]                                                                                                            |
| Object mode (`objectMode`/`withFileTypes`)          | Y           | Y      | Y        | N           | N            | tiny-glob, tinyglobby: no object mode support [16]                                                                                                    |
| Dot files inclusion (`dot: true`)                   | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| **Path Handling**                                   |
| Relative paths                                      | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| String path results                                 | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| **Platform Support**                                |
| Hidden files (Windows)                              | Y           | Y      | Y        | Y           | Y            |                                                                                                                                                       |
| UNC paths (`//server/share/*`)                      | Y           | Y      | Y        | N           | Y            | tiny-glob: throws EPERM error on UNC paths [17]                                                                                                       |
| Windows drive letters (`C:/*.js`)                   | Y           | N      | Y        | N           | N            | glob, tinyglobby: return 0 files; tiny-glob: EPERM errors [18]                                                                                        |

## References

- **[Glob Primer]**
- **[Bash Manual - Pattern Matching]**
- **[Minimatch]**

<!-- Library links -->
[fast-glob]: https://github.com/mrmlnc/fast-glob
[glob]: https://github.com/isaacs/node-glob
[globby]: https://github.com/sindresorhus/globby
[tiny-glob]: https://github.com/terkelg/tiny-glob
[tinyglobby]: https://github.com/SuperchupuDev/tinyglobby

<!-- Documentation links -->
[Asterisk]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Question mark]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Character classes]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Character ranges]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Negated classes]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Globstar]: https://www.gnu.org/software/bash/manual/html_node/The-Shopt-Builtin.html
[Brace expansion]: https://www.gnu.org/software/bash/manual/html_node/Brace-Expansion.html
[Plus]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Question]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[At]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Exclamation]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html

<!-- General references -->
[Glob Primer]: https://github.com/isaacs/node-glob#glob-primer
[Bash Manual - Pattern Matching]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Minimatch]: https://github.com/isaacs/minimatch

<p align="right"> <samp> Y = Yes, N = No <br> Please verify the information listed and let me know if you find inaccuracies. I would be happy to update the this table.</samp> </p>

## Notes

[1] **tiny-glob question mark bug:**

Testing reveals the potential issue is in the [globalyzer dependency](https://www.npmjs.com/package/globalyzer). In strict mode (default), the STRICT regex pattern doesn't recognize standalone `?` as a glob pattern:

```javascript
console.log(globalyzer('?.js'))     // { base: '.', glob: '?.js', isGlob: false }
console.log(globalyzer('file?.txt')) // { base: '.', glob: 'file?.txt', isGlob: false }

console.log(globalyzer('?.js', { strict: false }))     // { base: '.', glob: '?.js', isGlob: true }
console.log(globalyzer('file?.txt', { strict: false })) // { base: '.', glob: 'file?.txt', isGlob: true }
```

The STRICT regex [`/\\(.)|(^!|\*|[\].+)]\?|...)/`](https://github.com/terkelg/globalyzer/blob/master/src/index.js#L3) only matches `?` after `]` but not standalone `?`. When `isGlob: false`, tiny-glob attempts to find a literal file instead of performing glob matching.

---

[2] **tinyglobby negated character classes bug:**

tinyglobby returns inverted results for negated character classes. Pattern `[!abc].js` should match files that do NOT start with 'a', 'b', or 'c', but tinyglobby returns exactly those files (a.js, b.js, c.js) instead of the expected matches (d.js, e.js).

This violates the POSIX glob standard where `[!characters]` means "any character NOT in the set". See [POSIX.1-2017 Pattern Matching Notation](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_13_01) section 2.13.1:

> "If an open bracket introduces a bracket expression as in XBD RE Bracket Expression, except that the <exclamation-mark> character ( '!' ) shall replace the <circumflex> character ( '^' ) in its role in a non-matching list in the regular expression notation"

---

[3] **tiny-glob numeric range limitation:**

tiny-glob returns empty results for all numeric range patterns like `{1..3}` or `{01..02}`. The [globrex dependency](https://www.npmjs.com/package/globrex) lacks support for numeric range expansion (`{start..end}` syntax) and only supports comma-separated alternatives (`{a,b,c}`).

```javascript
const globrex = require('globrex');

// Numeric ranges not supported - treats dots as literal characters
globrex('{1..3}', { extended: true })
// Returns: { regex: /^(1\.\.3)$/ } - literal dots, not range expansion

// Comma-separated works correctly
globrex('{1,2,3}', { extended: true })
// Returns: { regex: /^(1|2|3)$/ } - proper alternation
```

---

[4] **tinyglobby zero-padded range limitation:**

tinyglobby fails to match zero-padded numeric ranges like `{01..02}` while successfully handling simple ranges like `{1..3}`. The issue stems from the [picomatch dependency](https://www.npmjs.com/package/picomatch) where the `expandRange` function attempts to create a character class `[01-03]` which is invalid regex syntax. When this fails, picomatch falls back to literal string `01..03` instead of expanding to individual values `(01|02|03)`.

```javascript
const picomatch = require('picomatch');

// Simple ranges work (single digits create valid character classes)
picomatch.parse('{1..3}')
// Returns: { output: '[1-3]' }

// Zero-padded ranges fail (multi-digit strings invalid in character classes)
picomatch.parse('{01..03}')
// Returns: { output: '01..03' } - literal fallback, not regex alternation
```

---

[5] **globby negated extglob limitation:**

globby treats extglob negation patterns like `!(foo|bar).js` as negative patterns and converts them to ignore rules for fast-glob. The `convertNegativePatterns` function processes any pattern starting with `!` as a negative pattern, but extglob `!(pattern)` syntax should be passed directly to fast-glob for proper extglob handling.

```javascript
const { globby } = require('globby');
const fastGlob = require('fast-glob');
const fs = require('fs');

['foo.js', 'bar.js', 'baz.js'].forEach(file => fs.writeFileSync(file, ''));

async function test() {
  const globbyResult = await globby('!(foo|bar).js');
  const fastGlobResult = await fastGlob('!(foo|bar).js');

  console.log('globby:', globbyResult.length);     // 0
  console.log('fast-glob:', fastGlobResult.length); // 1
}

test().then(() => {
  ['foo.js', 'bar.js', 'baz.js'].forEach(file => fs.unlinkSync(file));
});
```

---

[6] **glob and tiny-glob pattern array limitations:**

glob ignores negation patterns in arrays and returns all matched files including those that should be excluded. tiny-glob doesn't support pattern arrays at all, throwing `glob.startsWith is not a function` error when passed an array instead of a string pattern.

```javascript
// glob returns ignore.js despite negation
await glob.glob(['*.js', '!ignore.js']); // Returns: app.js, config.js, test.js, ignore.js

// tiny-glob fails with any arrays
await tinyGlob(['*.js', '*.json']); // Error: glob.startsWith is not a function
```

---

[7] **Basename matching limitation:**

tiny-glob and tinyglobby do not support basename matching options (`baseNameMatch` or `matchBase`). These options allow patterns without slashes to match files in any directory based on their basename.

```javascript
// Works: fast-glob, glob, globby
await fastGlob('index.js', { baseNameMatch: true });
// Returns: ['index.js', 'src/index.js', 'src/components/index.js']

// Doesn't work: tiny-glob, tinyglobby
await tinyGlob('index.js', { baseNameMatch: true });
// Returns: ['index.js'] - only matches in current directory
```

---

[8] **tiny-glob ignore option limitation:**

tiny-glob does not support the `ignore` option and returns all matched files regardless of ignore patterns specified. The library lacks built-in filtering capabilities for excluding files based on patterns.

```javascript
// tiny-glob ignores the ignore option
await tinyGlob('*', { ignore: ['*.tmp'] }); // Returns all files including *.tmp

// Other libraries respect ignore option
await fastGlob('*', { ignore: ['*.tmp'] }); // Excludes *.tmp files
```

---

[9] **tinyglobby negated ignore patterns issue:**

tinyglobby returns empty results when negated patterns are used in the `ignore` option, while fast-glob silently ignores such patterns. This caused cspell to rollback their migration from fast-glob to tinyglobby. The issue is tracked in tinyglobby#32

---

[10] **Gitignore file support:**

Only globby supports automatic reading and application of .gitignore files through the `gitignore: true` option. Other libraries require manual parsing of .gitignore files and passing patterns to the `ignore` option.

```javascript
// Only globby supports gitignore option
await globby('*', { gitignore: true }); // Automatically excludes files from .gitignore

// Other libraries ignore the gitignore option
await fastGlob('*', { gitignore: true }); // Option ignored, returns all files
```

---

[11] **Custom ignore files support:**

Only globby supports reading and applying custom ignore files through the `ignoreFiles` option. This allows using project-specific ignore files like `.eslintignore`, `.prettierignore`, or custom ignore files.

```javascript
// Only globby supports ignoreFiles option
await globby('*', { ignoreFiles: ['.customignore', '.eslintignore'] });

// Other libraries ignore the ignoreFiles option
await fastGlob('*', { ignoreFiles: ['.customignore'] }); // Option ignored
```

---

[12] **tinyglobby case sensitivity issues:**

tinyglobby has problems with case sensitive mode, returning 0 files when `caseSensitiveMatch: true` is set.

---

[13] **tiny-glob depth limitation:**

tiny-glob ignores `deep` and `maxDepth` options, always returning all files regardless of depth settings.

---

[14] **glob and tiny-glob file type filtering:**

glob and tiny-glob ignore `onlyFiles`, `onlyDirectories`, and related filtering options, always returning both files and directories.

---

[15] **Directory marking limitation:**

glob and tiny-glob don't support marking directories with trailing slashes through `markDirectories` or `mark` options.

---

[16] **Object mode limitation:**

tiny-glob and tinyglobby don't support object mode, always returning string arrays instead of objects with file metadata.

```javascript
// Works: fast-glob, glob, globby
await fastGlob('*', { objectMode: true });
// Returns: [{ name: 'file.js', path: 'file.js', dirent: <fs.Dirent> }]

// Doesn't work: tiny-glob, tinyglobby
await tinyGlob('*', { objectMode: true });
// Returns: ['file.js'] - ignores objectMode option
```

---

[17] **tiny-glob UNC path limitation:**

tiny-glob throws `EPERM: operation not permitted` errors when attempting to access UNC (Uniform Naming Convention) paths on Windows. The issue occurs in the `walk` function when `fs.lstatSync()` is called on UNC paths without proper error handling. Other libraries handle UNC patterns gracefully with appropriate error handling.

```javascript
// tiny-glob fails with UNC paths due to fs.lstatSync() error
await tinyGlob('//localhost/c$/*.js'); // Error: EPERM: operation not permitted, lstat '\\localhost\c$\...'

// Other libraries handle gracefully
await fastGlob('//localhost/c$/*.js'); // Returns: []
```

---

[18] **Windows drive letter support:**

Only fast-glob and globby properly support Windows drive letter patterns like `E:/*.js`. glob and tinyglobby return empty results for such patterns but work with absolute paths. tiny-glob throws `EPERM: operation not permitted` errors when accessing system directories on specified drives.

```javascript
// Works: fast-glob, globby
await fastGlob('E:/*.js'); // Returns files on E: drive

// Returns empty: glob, tinyglobby
await glob('E:/*.js'); // Returns: []

// Throws error: tiny-glob
await tinyGlob('E:/*.js'); // Error: EPERM: operation not permitted
```
