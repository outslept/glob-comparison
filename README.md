![alt text](./banner.png)

## Feature Comparison Matrix

| Feature / library                             | [`fast-glob`] | [`glob`] | [`globby`] | [`tiny-glob`] | [`tinyglobby`] | [`node:fs`] | Notes                                                                                                                                                                                                          |
| --------------------------------------------- | :-----------: | :------: | :--------: | :-----------: | :------------: | :---------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic Patterns**                            |
| Asterisk (`*`) - Files                        |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries match regular files consistently                                                                                                                                                                 |
| Asterisk (`*`) - Directories                  |      ❌       |    ✅    |     ❌     |      ✅       |       ❌       |     ✅      | Directory inclusion behavior varies [[1]](#1-directory-inclusion-differences)                                                                                                                                  |
| Asterisk (`*`) - Hidden files (`.hidden`)     |      ❌       |    ❌    |     ❌     |      ⚠️       |       ❌       |     ❌      | Inconsistent default behavior [[2]](#2-dotfile-handling-inconsistencies)                                                                                                                                       |
| Asterisk (`*`) - Config files (`.config`)     |      ❌       |    ❌    |     ❌     |      ❌       |       ❌       |     ❌      | Inconsistent default behavior [[2]](#2-dotfile-handling-inconsistencies)                                                                                                                                       |
| Result ordering                               |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ⚠️      | Non-deterministic ordering [[3]](#3-indeterminate-result-ordering)                                                                                                                                             |
| Question mark (`?`)                           |      ✅       |    ✅    |     ✅     |      ❌       |       ✅       |     ✅      | `tiny-glob` does not recognize most `?` patterns [[8]](#8-tiny-glob-question-mark-limitation)                                                                                                                  |
| **Character Classes**                         |
| Basic character ranges (`[abc]`)              |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries handle basic ranges consistently                                                                                                                                                                 |
| Range character classes (`[a-z]`)             |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries handle lowercase ranges consistently                                                                                                                                                             |
| Case-sensitive ranges (`[A-Z]`)               |      ❌       |    ⚠️    |     ❌     |      ❌       |       ❌       |     ⚠️      | `glob` and `node:fs` are case-insensitive [[6]](#6-platform-dependent-case-sensitivity)                                                                                                                        |
| Mixed case ranges (`[a-zA-Z]`)                |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries handle mixed ranges consistently                                                                                                                                                                 |
| Numeric ranges (`[0-9]`)                      |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries handle numeric ranges consistently                                                                                                                                                               |
| Negated ranges (`[!abc]`)                     |      ✅       |    ✅    |     ✅     |      ✅       |       ❌       |     ✅      | `tinyglobby` systematically inverts all `[!...]` patterns [[7]](#7-negation-handling-bugs)                                                                                                                     |
| Caret negation (`[^abc]`)                     |      ✅       |    ✅    |     ✅     |      ❌       |       ✅       |     ✅      | `tiny-glob` systematically inverts all `[^...]` patterns [[7]](#7-negation-handling-bugs)                                                                                                                      |
| Negated case-sensitive ranges (`[!A-Z]`)      |      ✅       |    ⚠️    |     ✅     |      ✅       |       ❌       |     ⚠️      | Case sensitivity affects negation behavior [[6]](#6-platform-dependent-case-sensitivity) • [[7]](#7-negation-handling-bugs)                                                                                    |
| Empty negation classes (`[!]`, `[^]`)         |      ✅       |    ✅    |     ✅     |      ⚠️       |       ✅       |     ✅      | `tiny-glob` treats `[!]` as "match everything" [[7]](#7-negation-handling-bugs)                                                                                                                                |
| **Brace Expansion**                           |
| Basic expansion (`{js,ts}`)                   |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries handle basic brace expansion consistently [[9]](#9-brace-expansion-result-ordering)                                                                                                              |
| Nested expansion (`*.{spec,test}.js`)         |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries handle nested expansion consistently [[9]](#9-brace-expansion-result-ordering)                                                                                                                   |
| Multiple expansion (`{app,config}.{js,json}`) |      ✅       |    ✅    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries handle multiple expansion consistently [[9]](#9-brace-expansion-result-ordering)                                                                                                                 |
| Numeric ranges (`{1..3}`)                     |      ✅       |    ✅    |     ✅     |      ❌       |       ✅       |     ✅      | `tiny-glob` doesn't support numeric ranges [[10]](#10-tiny-glob-numeric-range-limitation) • [[9]](#9-brace-expansion-result-ordering)                                                                          |
| Zero-padded ranges (`{01..03}`)               |      ✅       |    ✅    |     ✅     |      ❌       |       ❌       |     ✅      | `tiny-glob` and `tinyglobby` don't support zero-padded ranges [[10]](#10-tiny-glob-numeric-range-limitation) • [[11]](#11-tinyglobby-zero-padded-range-limitation) • [[9]](#9-brace-expansion-result-ordering) |
| Single item braces (`{js}`)                   |    Literal    | Literal  |  Literal   |    Expands    |    Literal     |   Literal   | `tiny-glob` expands single items while others treat as literal [[12]](#12-tiny-glob-single-item-brace-expansion) • [[9]](#9-brace-expansion-result-ordering)                                                   |
| **Extended Globs (Extglobs)**                 |
| Zero or more (`*(pattern)`)                   |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries support extglob patterns consistently [[3]](#3-indeterminate-result-ordering)                                                                                                                    |
| One or more (`+(pattern)`)                    |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries support extglob patterns consistently [[3]](#3-indeterminate-result-ordering)                                                                                                                    |
| Zero or one (`?(pattern)`)                    |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries support extglob patterns consistently [[3]](#3-indeterminate-result-ordering)                                                                                                                    |
| Exactly one (`@(pattern)`)                    |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries support extglob patterns consistently [[3]](#3-indeterminate-result-ordering)                                                                                                                    |
| Negated match (`!(pattern)`)                  |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ✅      | All libraries support extglob patterns consistently [[3]](#3-indeterminate-result-ordering)                                                                                                                    |
| **Globstar**                                  |
| Basic globstar (`**`)                         |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ⚠️      | Directory inclusion varies by library [[1]](#1-directory-inclusion-differences) • [[3]](#3-indeterminate-result-ordering)                                                                                      |
| Recursive globstar (`**/*`)                   |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ⚠️      | Directory inclusion varies by library [[1]](#1-directory-inclusion-differences) • [[3]](#3-indeterminate-result-ordering)                                                                                      |
| Nested globstar (`src/**/*.js`)               |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ⚠️      | All libraries handle nested patterns consistently [[3]](#3-indeterminate-result-ordering)                                                                                                                      |
| Path-specific globstar (`src/**`)             |      ✅       |    ⚠️    |     ✅     |      ⚠️       |       ✅       |     ⚠️      | `tiny-glob` excludes root directory [[13]](#13-tiny-glob-root-directory-exclusion) • Directory inclusion varies [[1]](#1-directory-inclusion-differences) • [[3]](#3-indeterminate-result-ordering)            |
| Mixed globstar (`**/components/*.js`)         |      ✅       |    ⚠️    |     ✅     |      ✅       |       ✅       |     ⚠️      | All libraries handle mixed patterns consistently [[3]](#3-indeterminate-result-ordering)                                                                                                                       |

---

## Detailed Notes

### [1] Directory Inclusion Differences

Libraries differ in whether they include directories when matching patterns:

**Include directories:** `glob`, `tiny-glob`, `node:fs`
**Files only:** `fast-glob`, `globby`, `tinyglobby`

This is a fundamental design difference that reflects different priorities.

This behavior is configurable in most libraries:

- `fast-glob`, `globby`, `tinyglobby`: Set `onlyFiles: false` to include directories
- `glob`: Set `nodir: true` to exclude directories
- `tiny-glob`: Set `filesOnly: true` to exclude directories

**Note:** This behavior is consistent across all pattern types, not just `*`.

[↑ Back to top](#feature-comparison-matrix)

---

### [2] Dotfile Handling Inconsistencies

**Root cause in `tiny-glob`:** Global regex state bug causes non-deterministic dotfile filtering.

```javascript
// tiny-glob source code
const isHidden = /(^|[\\\/])\.[^\\\/\.]/g; // ← Global flag retains state

// Test results demonstrate the bug:
// Pattern "*": includes .hidden when dot: false (17 vs 16 results)
// Pattern ".*": finds only .hidden, misses .config (1 vs 2 results)
```

**The issue:** The regex `lastIndex` property persists between `test()` calls, causing
dotfile filtering to depend on filesystem iteration order rather than consistent logic.

[↑ Back to top](#feature-comparison-matrix)

---

### [3] Indeterminate Result Ordering

Starting from `glob` v9, results are returned in **non-deterministic order**
that depends on your filesystem, operating system, disk controller, and other
environmental factors.

They may appear consistently reverse-alphabetical on some systems,
but this behavior is **not guaranteed** across different environments.

Unlike `glob` v8 which automatically sorted results using English locale,
you now need to manually sort if you depend on consistent ordering.

**Solution:**

```javascript
// Sort results just as version 8 did
glob.sync("pattern").sort((a, b) => a.localeCompare(b, "en"));

// Or use your preferred locale for locale-aware sorting
glob.sync("pattern").sort((a, b) => a.localeCompare(b, "de")); // German
glob.sync("pattern").sort((a, b) => a.localeCompare(b, "ja")); // Japanese
```

**References:**

- [Issue #576: glob v9 result ordering](https://github.com/isaacs/node-glob/issues/576)
- [v8.1.0 sorting](https://github.com/isaacs/node-glob/blob/v8.1.0/common.js?rgh-link-date=2024-03-01T08%3A48%3A35.000Z#L20)
- [Intl.Collator options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options)

[↑ Back to top](#feature-comparison-matrix)

---

### [4] tiny-glob invalid character range handling

`tiny-glob` raises an error when encountering invalid character ranges
(like `[9-1]` where the start character has a higher ASCII value than
the end character), while other libraries gracefully return no matches.

The issue occurs in the globrex dependency when used with `extended: true` option.
`tiny-glob` calls `globrex` with extended glob support enabled, which process `[9-1]`
as a character class, creating an invalid regex `/^[9-1]\.txt$/` that raises a runtime error.

**Error reproduction:**

```javascript
const globrex = require("globrex");

// This works (brackets treated as literals)
globrex("[9-1].txt"); // /^\[9-1\]\.txt$/

// This throws (brackets treated as character class)
globrex("[9-1].txt", { extended: true });
// Error: Invalid regular expression: /^[9-1]\.txt$/: Range out of order in character class

// tiny-glob uses extended: true internally
```

[↑ Back to top](#feature-comparison-matrix)

---

### [5] Platform-dependent case sensitivity behavior

Character class patterns with mixed case ranges behave differently
across platforms due to filesystem case sensitivity:

```javascript
// Files: a.js, b.js, c.js, A.js, B.js

// Windows (case-insensitive filesystem)
await fastGlob("[a-cA-C].js"); // ['a.js', 'b.js', 'c.js']

// Linux (case-sensitive filesystem)
await fastGlob("[a-cA-C].js"); // ['A.js', 'B.js', 'a.js', 'b.js', 'c.js']
```

This affects all glob libraries consistently and is a **filesystem-level behavior**
rather than a **library-specific difference**.

[↑ Back to top](#feature-comparison-matrix)

---

### [6] Platform-Dependent Case Sensitivity

`glob` and `node:fs` adapt to filesystem case sensitivity, while other libraries
remain case-sensitive regardless of platform:

```javascript
// Files: a.js, b.js, c.js, A.js, B.js, C.js

// On Windows (case-insensitive filesystem):
await glob("[A-C].js"); // ['c.js', 'b.js', 'a.js'] - matches lowercase
await nodeFs("[A-C].js"); // ['a.js', 'b.js', 'c.js'] - matches lowercase
await fastGlob("[A-C].js"); // [] - case-sensitive even on Windows

// On Linux (case-sensitive filesystem):
await glob("[A-C].js"); // [] - case-sensitive on Linux
await fastGlob("[A-C].js"); // [] - case-sensitive
```

- `glob`: Set `nocase: true/false` to override platform defaults
- `fast-glob`, `globby`, `tinyglobby`: Set `caseSensitiveMatch: false` for case-insensitive matching
- `tiny-glob`, `node:fs`: Not configurable

[↑ Back to top](#feature-comparison-matrix)

---

### [7] Negation Handling Bugs

**`tinyglobby`**: inverts `[!...]` patterns,
returning matches instead of exclusions

**`tiny-glob`**: inverts `[^...]` patterns,
returning matches instead of exclusions

```javascript
await tinyglobby("[!abc].js"); // returns ['a.js', 'b.js', 'c.js'] instead of ['d.js', 'e.js', 'z.js']
await tinyglobby("[!1-3].txt"); // returns ['1.txt', '2.txt', '3.txt'] instead of ['4.txt', '9.txt']

await tinyGlob("[^abc].js"); // returns ['a.js', 'b.js', 'c.js'] instead of ['d.js', 'e.js', 'z.js']
await tinyGlob("[^1-3].txt"); // returns ['1.txt', '2.txt', '3.txt'] instead of ['4.txt', '9.txt']
```

Both libraries handle the opposite negation syntax correctly
(`tiny-glob` works with `[!...]`, `tinyglobby` works with `[^...]`).

**Edge case:** `tiny-glob` treats empty negation `[!]` as
"match everything" while other libraries return no matches.

**Workarounds:**

- `tinyglobby`: Use `[^...]` syntax instead of `[!...]`
- `tiny-glob`: Use `[!...]` syntax instead of `[^...]`

[↑ Back to top](#feature-comparison-matrix)

---

### [8] tiny-glob question mark limitation

`tiny-glob` does not recognize most question mark patterns
as glob patterns due to its `globalyzer` dependency.

**Affected patterns:** All `?` patterns except those containing dots

```javascript
// These patterns fail (return 0 matches)
await tinyGlob("?.js"); // [] - should match ['a.js', 'b.js', 'c.js', 'z.js']
await tinyGlob("??.js"); // [] - should match ['ab.js', 'ac.js', 'az.js']
await tinyGlob("???.js"); // [] - should match ['abc.js', 'abd.js', 'xyz.js']
await tinyGlob("file?.txt"); // [] - should match ['file1.txt', 'file2.txt', 'file9.txt']
await tinyGlob("?"); // [] - should match ['a', 'b', 'c']

// Exception: dot patterns work correctly
await tinyGlob("?.?"); // ['a.b', 'x.y', 'z.z'] - works as expected
await tinyGlob("?.*"); // ['a.b', 'a.js', 'b.js', ...] - works as expected
await tinyGlob(".*?"); // ['.config', '.hidden'] - works as expected
```

**Root cause:** In strict mode (default), the globalyzer regex pattern does not
recognize standalone `?` as a glob pattern. When `isGlob: false`, `tiny-glob`
attempts to find a literal file instead of performing glob matching.

[↑ Back to top](#feature-comparison-matrix)

---

### [9] Brace expansion result ordering

Libraries handle brace expansion result ordering differently:

```javascript
// fast-glob, globby: preserve brace order
await fastGlob("foo.{js,ts,css}"); // ['foo.js', 'foo.ts', 'foo.css']
await globby("foo.{js,ts,css}"); // ['foo.js', 'foo.ts', 'foo.css']

// tiny-glob, tinyglobby: alphabetical order
await tinyGlob("foo.{js,ts,css}"); // ['foo.css', 'foo.js', 'foo.ts']
await tinyglobby("foo.{js,ts,css}"); // ['foo.css', 'foo.js', 'foo.ts']
```

This difference also applies to the non-deterministic ordering
behavior described in [[3]](#3-indeterminate-result-ordering).

[↑ Back to top](#feature-comparison-matrix)

---

### [10] tiny-glob numeric range limitation

`tiny-glob` does not support numeric range syntax in brace expansion.
The [globrex dependency](https://www.npmjs.com/package/globrex)
treats `..` as literal characters rather than range operators:

```javascript
// Supported by fast-glob, glob, globby, tinyglobby, node:fs
await fastGlob("file{1..3}.txt"); // ['file1.txt', 'file2.txt', 'file3.txt']
await glob("file{1..3}.txt"); // ['file1.txt', 'file2.txt', 'file3.txt']
await globby("file{1..3}.txt"); // ['file1.txt', 'file2.txt', 'file3.txt']
await tinyglobby("file{1..3}.txt"); // ['file1.txt', 'file2.txt', 'file3.txt']

// Not supported by tiny-glob
await tinyGlob("file{1..3}.txt"); // [] - no matches

// Comma-separated works in tiny-glob
await tinyGlob("file{1,2,3}.txt"); // ['file1.txt', 'file2.txt', 'file3.txt']
```

The globrex regex generation treats `{1..3}` as literal `(1\.\.3)`
instead of expanding to `(1|2|3)`.

[↑ Back to top](#feature-comparison-matrix)

---

### [11] tinyglobby zero-padded range limitation

`tinyglobby` does not match zero-padded numeric ranges while successfully handling simple ranges.
The issue stems from the [picomatch dependency](https://www.npmjs.com/package/picomatch)
where zero-padded ranges create invalid character class syntax:

```javascript
// Simple ranges work (fast-glob, glob, globby, tinyglobby, node:fs)
await fastGlob("file{1..3}.txt"); // ['file1.txt', 'file2.txt', 'file3.txt']
await tinyglobby("file{1..3}.txt"); // ['file1.txt', 'file2.txt', 'file3.txt']

// Zero-padded ranges fail in tinyglobby
await fastGlob("file{01..03}.txt"); // ['file01.txt', 'file02.txt', 'file03.txt']
await glob("file{01..03}.txt"); // ['file01.txt', 'file02.txt', 'file03.txt']
await globby("file{01..03}.txt"); // ['file01.txt', 'file02.txt', 'file03.txt']
await tinyglobby("file{01..03}.txt"); // [] - no matches

// tiny-glob fails on both
await tinyGlob("file{01..03}.txt"); // [] - no matches
```

Picomatch attempts to create character class `[01-03]` which is invalid regex syntax,
causing fallback to literal string matching.

[↑ Back to top](#feature-comparison-matrix)

---

### [12] tiny-glob single item brace expansion

`tiny-glob` expands single-item braces while other
libraries treat them as literal filenames:

```javascript
// Most libraries: treat as literal filename
await fastGlob("foo.{js}"); // ['foo.{js}'] - if literal file exists
await glob("foo.{js}"); // ['foo.{js}']
await globby("foo.{js}"); // ['foo.{js}']
await tinyglobby("foo.{js}"); // ['foo.{js}']

// tiny-glob: expands single-item braces
await tinyGlob("foo.{js}"); // ['foo.js'] - expands to foo.js
```

This behavior means `tiny-glob` will find `foo.js` when searching for `foo.{js}`,
while other libraries look for a file literally named `foo.{js}`.

[↑ Back to top](#feature-comparison-matrix)

---

### [13] tiny-glob root directory exclusion

`tiny-glob` exhibits unique behavior with path-specific globstar patterns,
excluding the root directory while including subdirectories:

```javascript
// Pattern: src/**
// Files: src/, src/index.js, src/utils/, src/utils/helper.js

// Most libraries include root directory
await glob("src/**"); // 12 results: ['src', 'src/utils', 'src/index.js', 'src/utils/helper.js', ...]
await fastGlob("src/**"); // 7 results: ['src/index.js', 'src/utils/helper.js', ...] (files only)
await node("src/**"); // 12 results: ['src', 'src/utils', 'src/index.js', 'src/utils/helper.js', ...]

// tiny-glob excludes root 'src' directory
await tinyGlob("src/**"); // 11 results: ['src/utils', 'src/index.js', 'src/utils/helper.js', ...] (no 'src')
```

This affects applications that expect the root directory
to be included in globstar results.

[↑ Back to top](#feature-comparison-matrix)
