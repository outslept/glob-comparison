![alt text](./banner.png)

## Feature Comparison Matrix

| Feature / Library                                 | [`fast-glob`](https://www.npmjs.com/package/fast-glob) | [`glob`](https://www.npmjs.com/package/glob) | [`globby`](https://www.npmjs.com/package/globby) | [`tiny-glob`](https://www.npmjs.com/package/tiny-glob) | [`tinyglobby`](https://www.npmjs.com/package/tinyglobby) | [`node:fs`](https://nodejs.org/api/fs.html) | Notes                                                                                                                                             |
| ------------------------------------------------- | :----------------------------------------------------: | :------------------------------------------: | :----------------------------------------------: | :----------------------------------------------------: | :------------------------------------------------------: | :-----------------------------------------: | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Package Information**                           |                                                        |                                              |                                                  |                                                        |                                                          |                                             | All the data for this row category was sourced from [node-modules-inspector](https://node-modules.dev)                                            |
| Package Type                                      |                          CJS                           |                     DUAL                     |                       ESM                        |                          CJS                           |                           DUAL                           |                     N/A                     |                                                                                                                                                   |
| Depends on (X) packages                           |                           17                           |                      33                      |                        22                        |                           2                            |                            2                             |                     N/A                     |                                                                                                                                                   |
| Total Size                                        |                       ~497.23KB                        |                   ~3.29MB                    |                     ~551.2KB                     |                        ~36.79KB                        |                        ~197.57KB                         |                     N/A                     |                                                                                                                                                   |
| **Basic Patterns**                                |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| Asterisk (**`*`**) - **Files**                    |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Asterisk (**`*`**) - **Directories**              |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | Directory inclusion differences [[1]](#1-directory-inclusion-differences).                                                                        |
| Asterisk (**`*`**) - **Hidden files (`.hidden`)** |                           ❌                            |                      ❌                       |                        ❌                         |                           ⚠️                           |                            ❌                             |                      ❌                      | Dotfile handling inconsistencies [[2]](#2-dotfile-handling-inconsistencies)                                                                       |
| Asterisk (**`*`**) - **Config files (`.config`)** |                           ❌                            |                      ❌                       |                        ❌                         |                           ❌                            |                            ❌                             |                      ❌                      | Dotfile handling inconsistencies [[2]](#2-dotfile-handling-inconsistencies)                                                                       |
| Asterisk (`*`) - **Result ordering**              |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                     ⚠️                      | Indeterminate result ordering [[3]](#3-indeterminate-result-ordering)                                                                             |
| Asterisk (`*`) - **Symlinks**                     |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Asterisk (`*`) - Special chars (`*.js`, `?.js`)   |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | Linux only (Windows doesn't allow **`*`** and **`?`** in filenames)                                                                               |
| Question mark (`?`)                               |                           ✅                            |                      ✅                       |                        ✅                         |                           ❌                            |                            ✅                             |                      ✅                      | tiny-glob question mark limitation [[4]]                                                                                                          |
| **Character Classes**                             |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| Basic character ranges (`[abc]`)                  |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Range character classes (`[a-z]`)                 |                           ✅                            |                      ✅                       |                        ✅                         |                           ⚠️                           |                            ✅                             |                      ✅                      | tiny-glob: throws error on invalid ranges (e.g. `[9-1]`)                                                                                          |
| Case-sensitive ranges (`[A-Z]`)                   |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                     ⚠️                      | Platform dependent case sensitivity [[5]]                                                                                                         |
| Mixed case ranges (`[a-zA-Z]`)                    |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Numeric ranges (`[0-9]`)                          |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Negated ranges (`[!abc]`)                         |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Caret negation (`[^abc]`)                         |                           ✅                            |                      ✅                       |                        ✅                         |                           ❌                            |                            ✅                             |                      ✅                      | Negation handling bugs [[6]]                                                                                                                      |
| Negated case-sensitive ranges (`[!A-Z]`)          |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                     ⚠️                      | Case sensitivity + negation [[5]]                                                                                                                 |
|                                                   |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| Empty negation classes (`[!]`, `[^]`)             |                           ✅                            |                      ✅                       |                        ✅                         |                           ⚠️                           |                            ✅                             |                      ✅                      | tiny-glob treats `[!]` as match-all [[6]]                                                                                                         |
| **POSIX Character Classes**                       |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| POSIX alpha (`[[:alpha:]]`)                       |                           ✅                            |                      ✅                       |                        ✅                         |                           ❌                            |                            ✅                             |                      ✅                      | Tiny-glob POSIX limitation [[7]]                                                                                                                  |
| POSIX digit (`[[:digit:]]`)                       |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| **Case Insensitive Support**                      |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| Case insensitive option                           |                           ✅                            |                      ✅                       |                        ✅                         |                           ❌                            |                            ✅                             |                      ❌                      |                                                                                                                                                   |
| **Brace Expansion**                               |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| Basic expansion (`{js,ts}`)                       |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | Indeterminate result ordering [[3]]                                                                                                               |
| Nested expansion (`*.{spec,test}.js`)             |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Multiple expansion (`{app,config}.{js,json}`)     |                           ✅                            |                      ✅                       |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      |                                                                                                                                                   |
| Numeric ranges (`{1..3}`)                         |                           ✅                            |                      ✅                       |                        ✅                         |                           ❌                            |                            ✅                             |                      ✅                      | tiny-glob numeric range limitation [[8]](#8-tiny-glob-numeric-range-limitation)                                                                   |
| Zero-padded ranges (`{01..03}`)                   |                           ✅                            |                      ✅                       |                        ✅                         |                           ❌                            |                            ❌                             |                      ✅                      | tinyglobby brace expansion limitations [9]                                                                                                        |
| Single item braces (`{js}`)                       |                        Literal                         |                   Literal                    |                     Literal                      |                        Expands                         |                         Literal                          |                   Literal                   | tiny-glob single-item expansion [[10]](#10-tiny-glob-single-item-brace-expansion)                                                                 |
| **Extended Globs (Extglobs)**                     |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| Zero or more (`*(pattern)`)                       |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | [[3]](#3-indeterminate-result-ordering)                                                                                                           |
| One or more (`+(pattern)`)                        |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | [[3]](#3-indeterminate-result-ordering)                                                                                                           |
| Zero or one (`?(pattern)`)                        |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | [[3]](#3-indeterminate-result-ordering)                                                                                                           |
| Exactly one (`@(pattern)`)                        |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | [[3]](#3-indeterminate-result-ordering)                                                                                                           |
| Negated match (`!(pattern)`)                      |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                      ✅                      | [[3]](#3-indeterminate-result-ordering)                                                                                                           |
| Negated extension (`*.!(js\|ts)`)                 |                           ✅                            |                      ✅                       |                        ✅                         |                           ❌                            |                            ✅                             |                      ✅                      | tiny-glob negated-extension mismatch [[14]](#14-tiny-glob-negated-extension-mismatch)                                                             |
| **Globstar**                                      |                                                        |                                              |                                                  |                                                        |                                                          |                                             |                                                                                                                                                   |
| Basic globstar (`**`)                             |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                     ⚠️                      | Directory inclusion + ordering [[1]](#1-directory-inclusion-differences) • [[3]](#3-indeterminate-result-ordering)                                |
| Recursive globstar (`**/*`)                       |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                     ⚠️                      | Directory inclusion + ordering [[1]](#1-directory-inclusion-differences) • [[3]](#3-indeterminate-result-ordering)                                |
| Nested globstar (`src/**/*.js`)                   |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                     ⚠️                      | [[3]](#3-indeterminate-result-ordering)                                                                                                           |
| Path-specific globstar (`src/**`)                 |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ⚠️                           |                            ✅                             |                     ⚠️                      | tiny-glob root directory exclusion [[13]](#13-tiny-glob-root-directory-exclusion) • directory inclusion [[1]](#1-directory-inclusion-differences) |
| Mixed globstar (`**/components/*.js`)             |                           ✅                            |                      ⚠️                      |                        ✅                         |                           ✅                            |                            ✅                             |                     ⚠️                      | [[3]](#3-indeterminate-result-ordering)                                                                                                           |

---

## Detailed Notes

### [1] Directory Inclusion Differences

Libraries differ in their default behavior for including directories in glob results. This affects all patterns that can match directories (e.g., `*`, `**`, `src/*`).


| Library      | Includes Directories | Includes Files | Configuration Option |
| ------------ | -------------------- | -------------- | -------------------- |
| `fast-glob`  | ❌                    | ✅              | `onlyFiles: false`   |
| `glob`       | ✅                    | ✅              | `nodir: true`        |
| `globby`     | ❌                    | ✅              | `onlyFiles: false`   |
| `tiny-glob`  | ✅                    | ✅              | `filesOnly: false`   |
| `tinyglobby` | ❌                    | ✅              | `onlyFiles: false`   |
| `node:fs`    | ✅                    | ✅              | N/A                  |

**Additional notes:**

- `tinyglobby` adds trailing slashes to directories (`src/` vs `src`)
- This behavior is not tied to asterisk pattern only.

[↑ Back to top](#feature-comparison-matrix)

---

### [2] Dotfile Handling Inconsistencies

`tiny-glob` inconsistently handles dotfiles when `dot: false`. The internal regex uses the global flag, causing state leakage across calls and incorrect matching of hidden entries for simple patterns.

```javascript
const isHidden = /(^|[\\\/])\.[^\\\/\.]/g
```

Observed:

- `"*"` and `"*.*"` include `.hidden`
- `".*"` returns only `.hidden`, missing `.config`

Reproduction:

```javascript
await tinyGlob("*",   { cwd: "test-fixtures" }); // includes '.hidden'
await tinyGlob("*.*", { cwd: "test-fixtures" }); // includes '.hidden'
await tinyGlob(".*",  { cwd: "test-fixtures" }); // ['.hidden'] (misses '.config')
```

[↑ Back to top](#feature-comparison-matrix)

---

### [3] Indeterminate Result Ordering

From `glob` v9+, results are not sorted at all and the order is non-deterministic, determined by operating system latency. Do not depend on the ordering unless you sort explicitly.

The ordering you observe is entirely dependent on how your computer's filesystem chooses to return results. On different operating systems, filesystems, disk controllers, or system states, results could easily be returned in alphabetical order, reverse alphabetical order, order of last access, entirely random, or any other arbitrary order.

What appears as "consistent reverse alphabetical order" on one system is simply an artifact of that specific filesystem's internal structure and current state. So for deterministic behavior, always sort results explicitly.

Reproduction:

```javascript
glob.sync("**/*", { cwd: "test-fixtures" }).sort((a, b) => a.localeCompare(b, "en"));
```

References:

- https://github.com/isaacs/node-glob/issues/576
- https://github.com/isaacs/node-glob/blob/v8.1.0/common.js#L20
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options

[↑ Back to top](#feature-comparison-matrix)

---

### [4] tiny-glob Question Mark limitation

`tiny-glob` fails to detect simple question mark patterns as globs due to its glob detection regex. The pattern falls back to literal file matching instead of wildcard behavior.

The issue occurs in the `isglob` function within `globalyzer`. The STRICT regex pattern used by default does not properly match standalone `?` characters, causing patterns like `?.js` to be treated as literal filenames rather than glob expressions.

```js
// These patterns fail (not detected as globs):
await tinyGlob("?.js", { cwd: "test-fixtures" }); // [] ❌
await tinyGlob("??.js", { cwd: "test-fixtures" }); // [] ❌
await tinyGlob("file?.txt", { cwd: "test-fixtures" }); // [] ❌
await tinyGlob("?", { cwd: "test-fixtures" }); // [] ❌

// These work (more complex patterns detected as globs):
await tinyGlob("?.?", { cwd: "test-fixtures" }); // ['a.b','x.y','z.z'] ✅
await tinyGlob("?.*", { cwd: "test-fixtures" }); // ['a.js','b.js',...] ✅
```

[↑ Back to top](#feature-comparison-matrix)

---

### [5] Platform-dependent case sensitivity behavior

`glob` and `node:fs` adapt to platform case sensitivity; `fast-glob`, `globby`, `tinyglobby` are case-sensitive by default. Mixed-case ranges produce different results depending on filesystem case sensitivity.

Reproduction:

```javascript
// Windows
await glob("[A-C].js", { cwd: "test-fixtures" }); // ['a.js','b.js','c.js']
await fastGlob("[A-C].js", { cwd: "test-fixtures" }); // []

// Linux
await glob("[A-C].js", { cwd: "test-fixtures" }); // ['A.js','B.js','C.js']
await fastGlob("[A-C].js", { cwd: "test-fixtures" }); // ['A.js','B.js','C.js']

// Mixed case ranges
await fastGlob("[a-cA-C].js", { cwd: "test-fixtures" });
// Windows: ['a.js','b.js','c.js']
// Linux: ['A.js','B.js','a.js','b.js','c.js']
```

[↑ Back to top](#feature-comparison-matrix)

---

### [6] Negation Handling Bugs

`tiny-glob` inverts caret-negated classes `[^...]`. Bracket-negation `[!...]` works correctly.

Reproduction:

```javascript
await tinyGlob("[^abc].js", { cwd: "test-fixtures" }); // ['a.js','b.js','c.js'] ❌ (wrong)

await fastGlob("[^abc].js", { cwd: "test-fixtures" }); // ['A.js','B.js','C.js','d.js','z.js'] ✅
await tinyGlob("[!abc].js", { cwd: "test-fixtures" }); // ['A.js','B.js','C.js','d.js','z.js'] ✅
```

**Edge case:** `tiny-glob` treats `[!]` as match-all, whereas others return no matches.

[↑ Back to top](#feature-comparison-matrix)

---

### [7] tiny-glob POSIX Character Class Limitation

`tiny-glob` does not support POSIX alpha character classes `[[:alpha:]]`, but supports digit classes `[[:digit:]]`. This inconsistent POSIX support makes it unreliable for portable character class patterns.

Reproduction:

```javascript
// POSIX alpha fails
await tinyGlob("[[:alpha:]]*.js", { cwd: "test-fixtures" }); // [] ❌
// Should find: ['a.js', 'b.js', 'c.js', 'A.js', 'B.js', ...]

// POSIX digit works
await tinyGlob("*[[:digit:]].js", { cwd: "test-fixtures" }); // ['alnum1.js', 'digit9.js', ...] ✅

// Other libraries support both
```

[↑ Back to top](#feature-comparison-matrix)

---

### [8] tiny-glob numeric range limitation

`tiny-glob` does not support numeric or alphabetic range expansions in braces. (`{1..3}`, `{a..c}`). The underlying `globrex` library only handles comma-separated brace lists by converting them to regex alternations, but **treats range syntax as literal characters**.

- `{js,ts}` → regex `(js|ts)` ✅
- `{1..3}` → regex `(1\.\.3)` ❌ (literal dots, not expansion)

**Supported:**

- ✅ Comma-delimited: `{js,ts,css}` → `(js|ts|css)`
- ✅ Single item: `{js}` → `(js)`

**Not supported:**

- ❌ Numeric ranges: `{1..3}` → `(1\.\.3)` (searches for literal "1..3")
- ❌ Alpha ranges: `{a..c}` → `(a\.\.c)` (searches for literal "a..c")
- ❌ Zero-padded: `{01..05}` → `(01\.\.05)`

Reproduction:

```javascript
// Works - comma separation converted to regex alternation
await tinyGlob('*.{js,ts}'); // finds *.js and *.ts files

// Fails - range treated as literal string
await tinyGlob('file{1..3}.txt'); // looks for literal "file1..3.txt"
await tinyGlob('{a..c}.js'); // looks for literal "a..c.js"
```

[↑ Back to top](#feature-comparison-matrix)

---

### [9] tinyglobby brace expansion limitations

`tinyglobby` uses `picomatch` for pattern matching, which has limited support for brace expansions.

**Observed behavior during testing:**

| Pattern            | Files Present                            | tinyglobby Result                         | Status |
| ------------------ | ---------------------------------------- | ----------------------------------------- | ------ |
| `*.{js,ts}`        | `app.js`, `app.ts`, etc.                 | `['app.js', 'app.ts', ...]`               | ✅      |
| `file{1..3}.txt`   | `file1.txt`, `file2.txt`, `file3.txt`    | `['file1.txt', 'file2.txt', 'file3.txt']` | ✅      |
| `{a..c}.js`        | `a.js`, `b.js`, `c.js`                   | `['a.js', 'b.js', 'c.js']`                | ✅      |
| `file{01..05}.txt` | `file01.txt`, `file02.txt`, `file05.txt` | `[]`                                      | ❌      |
| `app.{js}`         | `app.js`                                 | `[]`                                      | ❌      |

 While `picomatch` correctly parses most brace patterns, zero-padded ranges are converted to literal strings (`01..05`) rather than expanded ranges, causing match failures. Single-item braces are escaped as literals rather than expanded. Pattern parsing shows:

- `{1..3}` -> `[1-3]` (character class)
- `{01..05}` -> `01..05` (literal string)
- `{js}` -> `{\js\}` (escaped literal)

Reproduction:

```javascript
import { glob } from 'tinyglobby';

// Test environment: files file01.txt, file02.txt, file05.txt exist
await glob('file{1..3}.txt'); // ['file1.txt', 'file2.txt', 'file3.txt']
await glob('file{01..05}.txt'); // [] - no matches despite files existing

// Test environment: app.js exists
await glob('app.{js}'); // [] - no match despite file existing
```

References:

https://github.com/micromatch/picomatch/pull/134
https://github.com/micromatch/picomatch
https://github.com/SuperchupuDev/tinyglobby/issues/148

[↑ Back to top](#feature-comparison-matrix)

---

### [10] tiny-glob single item brace expansion

Single-item braces are expanded by `tiny-glob`, while others treat them as literals.

Reproduction:

```javascript
await tinyGlob("foo.{js}", { cwd: "test-fixtures" }); // ['foo.js']
await fastGlob("foo.{js}", { cwd: "test-fixtures" }); // [] unless literal 'foo.{js}' exists
```

[↑ Back to top](#feature-comparison-matrix)

---

### [13] tiny-glob root directory exclusion

`tiny-glob` excludes the root directory in path-specific globstar patterns like `src/**`, while including subdirectories and files.

Reproduction:

```javascript
await tinyGlob("src/**", { cwd: "test-fixtures" }); // no 'src' entry
await glob("src/**",     { cwd: "test-fixtures" }); // includes 'src'
```

[↑ Back to top](#feature-comparison-matrix)

---

### [14] tiny-glob negated extension mismatch

`*.!(js|ts)` returns an incomplete set in `tiny-glob` compared to others (extensions like `.jsx`/`.tsx` are missing).

Reproduction:

```javascript
await fastGlob("*.!(js|ts)", { cwd: "test-fixtures" }); // more matches
await tinyGlob("*.!(js|ts)", { cwd: "test-fixtures" }); // fewer matches
```

[↑ Back to top](#feature-comparison-matrix)

---

### [15] tinyglobby step range inconsistency (Windows)

`picomatch` does not expand braces. `tinyglobby` performs pre-expansion. On Windows, stepped ranges may expand incorrectly.

Reproduction:

```javascript
// Windows
await tinyglobby("file{1..5..2}.txt", { cwd: "test-fixtures" });
// Expected: ['file1.txt','file3.txt','file5.txt']
// Observed: ['file1.txt','file2.txt','file5.txt']

// Linux
await tinyglobby("file{1..5..2}.txt", { cwd: "test-fixtures" });
// ['file1.txt','file3.txt','file5.txt']
```

[↑ Back to top](#feature-comparison-matrix)
