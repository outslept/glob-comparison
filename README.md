![alt text](./banner.png)

## Author's Note

While working on various projects, I found myself curious about the subtle differences between glob libraries. Sometimes I get interested in seemingly mundane technical details, and glob pattern matching turned out to be one of those rabbit holes.

What started as casual research grew into this analysis. The existing documentation, while helpful, didn't provide the granular comparison I was looking for.

This analysis is based on testing of real glob patterns across all major libraries. Each behavior documented here has been verified through actual code execution.

**Note on Node.js built-in glob:** At the time of writing, even basic documentation improvements for `node:fs` glob functionality haven't been merged yet. The API and behavior may still change.

The goal is to provide an objective reference for developers who need to understand these differences when choosing a glob library for their projects.

## Table of Contents

- [Feature Comparison Matrix](#feature-comparison-matrix)
- [Detailed Notes](#detailed-notes)
- [References & Resources](#references--resources)

---

## Feature Comparison Matrix

| Feature | [`fast-glob`] | [`glob`] | [`globby`] | [`tiny-glob`] | [`tinyglobby`] | [`node:fs`] | Notes |
|---------|:-------------:|:--------:|:----------:|:-------------:|:--------------:|:-----------:|-------|
| **Basic Patterns** |
| Asterisk (`*`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `glob`: indeterminate ordering [[1]](#1-indeterminate-result-ordering) |
| Character ranges (`[a-z]`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tiny-glob`: throws on invalid ranges [[2]](#2-tiny-glob-invalid-character-range-handling) • Platform-dependent case sensitivity [[3]](#3-platform-dependent-case-sensitivity-behavior) |
| Negated classes (`[!abc]`) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tinyglobby`: inverts logic [[4]](#4-tinyglobby-negated-character-classes-issue) • `tiny-glob`: empty class issues [[5]](#5-tiny-glob-empty-negated-class-handling) |
| Caret negated classes (`[^abc]`) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tiny-glob`: inverts caret logic [[6]](#6-tiny-glob-caret-negation-inversion) |
| Negated ranges (`[!a-c]`, `[!A-Z]`) | ✅ | Partial | ✅ | ✅ | ❌ | Partial | [[1]](#1-indeterminate-result-ordering) • `glob`, `node:fs`: case issues [[7]](#7-glob-negated-range-case-sensitivity) • `tinyglobby`: inverts logic [[4]](#4-tinyglobby-negated-character-classes-issue) |
| Complex negated ranges (`[!a-zA-Z]`) | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tinyglobby`: inverts logic [[4]](#4-tinyglobby-negated-character-classes-issue) |
| Question mark (`?`) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tiny-glob`: recognition issues [[8]](#8-tiny-glob-question-mark-limitation) |
| **Brace Expansion** |
| Basic expansion (`{js,ts}`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • Result ordering varies [[9]](#9-brace-expansion-result-ordering) |
| Nested expansion (`*.{spec,test}.js`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) |
| Multiple expansion (`{app,config}.{js,json}`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) |
| Numeric ranges (`{1..3}`) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tiny-glob`: no support [[10]](#10-tiny-glob-numeric-range-limitation) |
| Zero-padded ranges (`{01..03}`) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tiny-glob`: no support [[10]](#10-tiny-glob-numeric-range-limitation) • `tinyglobby`: fails [[11]](#11-tinyglobby-zero-padded-range-limitation) |
| Single item braces (`{js}`) | Literal | Literal | Literal | Expands | Literal | Literal | `tiny-glob`: expands single items [[12]](#12-tiny-glob-single-item-brace-expansion) |
| **Globstar** |
| Basic globstar (`**`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • `tiny-glob`: different ordering [[13]](#13-tiny-glob-globstar-ordering) • `glob`, `node:fs`: Windows backslashes [[14]](#14-path-separator-differences-on-windows) |
| Nested globstar (`src/**/*.js`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • [[13]](#13-tiny-glob-globstar-ordering) • [[14]](#14-path-separator-differences-on-windows) |
| Mixed globstar (`**/components/*.js`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) • [[13]](#13-tiny-glob-globstar-ordering) • [[14]](#14-path-separator-differences-on-windows) |
| **Extended Glob (ExtGlob)** |
| Zero or more (`*(pattern)`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) |
| Exactly one (`@(pattern)`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) |
| Negation (`!(pattern)`) | ✅ | ✅ | Partial | ✅ | ✅ | ✅ | `globby`: fails on leading `!` [[15]](#15-globby-negated-extglob-limitation) • Different negation logic [[16]](#16-extglob-negation-logic-differences) • [[1]](#1-indeterminate-result-ordering) |
| One or more (`+(pattern)`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) |
| Zero or one (`?(pattern)`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) |
| **Special Behaviors** |
| Hidden files with `*` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | `tiny-glob`: includes hidden files [[17]](#17-tiny-glob-hidden-files-behavior) |
| Hidden files with `*.*` | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ | `glob`, `tiny-glob`, `node:fs`: include dot files [[18]](#18-dot-file-handling-differences) |
| Case sensitivity (`*.js` vs `*.JS`) | Strict | Loose | Strict | Strict | Strict | Loose | `glob`, `node:fs`: loose matching [[19]](#19-case-sensitivity-differences) |
| Hidden files with extension (`.*`) | ✅ | ✅ | ✅ | Partial | ✅ | ✅ | `tiny-glob`: misses complex patterns [[20]](#20-tiny-glob-hidden-extension-limitation) |
| Directory inclusion in results | Files only | Files+Dirs | Files only | Files+Dirs | Files only | Files+Dirs | `glob`, `tiny-glob`, `node:fs`: include directories [[21]](#21-directory-inclusion-differences) |
| **Configuration Options** |
| Depth limiting | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | [[1]](#1-indeterminate-result-ordering) |
| Basename matching | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | `fast-glob`, `glob`: support basename matching [[22]](#22-basename-matching-support) |
| Case sensitivity control | ✅ | ✅ | ✅ | Partial | ✅ | ✅ | `tiny-glob`: restrictive behavior [[23]](#23-tiny-glob-case-sensitivity) • [[1]](#1-indeterminate-result-ordering) |
| **Path Handling** |
| Absolute paths | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `glob`, `tiny-glob`, `node:fs`: Windows backslashes [[14]](#14-path-separator-differences-on-windows) • [[1]](#1-indeterminate-result-ordering) |
| Relative paths | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | `glob`, `tiny-glob`, `node:fs`: Windows backslashes [[14]](#14-path-separator-differences-on-windows) • [[1]](#1-indeterminate-result-ordering) |
| **Package Information** |
| Bundle size (min+gzip) | TBD | TBD | TBD | TBD | TBD | Built-in |
| Dependencies count | TBD | TBD | TBD | TBD | TBD | 0 |
| Module format support | ESM/CJS | ESM/CJS | ESM only | CJS only | ESM/CJS | ESM/CJS |
| TypeScript support | Built-in | @types | Built-in | None | Built-in | Built-in |

---

## Detailed Notes

### [1] Indeterminate Result Ordering

> **Critical Behavior Change in `glob` v9+**

Starting from `glob` v9, results are returned in **non-deterministic order** that depends on your filesystem, operating system, disk controller, and other environmental factors. They may appear consistently reverse-alphabetical on some systems, but this behavior is **not guaranteed** across different environments.

Unlike `glob` v8 which automatically sorted results using English locale, you now need to manually sort if you depend on consistent ordering.

**Solution:**

```
// Sort results just as version 8 did
glob.sync('pattern').sort((a, b) => a.localeCompare(b, 'en'))
```

**References:**
- [Issue #576: glob v9 result ordering](https://github.com/isaacs/node-glob/issues/576)
- [v8.1.0 sorting implementation](https://github.com/isaacs/node-glob/blob/v8.1.0/common.js?rgh-link-date=2024-03-01T08%3A48%3A35.000Z#L20)

[↑ Back to top](#feature-comparison-matrix)

---

### [2] tiny-glob invalid character range handling

`tiny-glob` throws an error when encountering invalid character ranges (like `[9-1]` where the start character has a higher ASCII value than the end character), while other libraries gracefully return no matches.

**Error Example:**

```javascript
// All other libraries handle gracefully
await fastGlob('[9-1].txt');  // []
await glob('[9-1].txt'); // []
await globby('[9-1].txt');    // []
await tinyglobby('[9-1].txt'); // []

// tiny-glob throws error
await tinyGlob('[9-1].txt');
// Error: Invalid regular expression: /^[9-1]\.txt$/: Range out of order in character class
```

[↑ Back to top](#feature-comparison-matrix)

---

### [3] Platform-dependent case sensitivity behavior

Character class patterns with mixed case ranges behave differently across platforms due to filesystem case sensitivity:

```javascript
// Files: a.js, b.js, c.js, A.js, B.js

// Windows (case-insensitive filesystem)
await fastGlob('[a-cA-C].js');  // ['a.js', 'b.js', 'c.js']

// Linux (case-sensitive filesystem)
await fastGlob('[a-cA-C].js');  // ['A.js', 'B.js', 'a.js', 'b.js', 'c.js']
```

This affects all glob libraries consistently and is a **filesystem-level behavior** rather than a **library-specific difference**.

[↑ Back to top](#feature-comparison-matrix)

---

### [4] tinyglobby negated character classes issue

`tinyglobby` handles negated character classes differently from the standard glob behavior. Instead of excluding characters, it includes them:

```javascript
// Standard behavior (fast-glob, glob, globby, tiny-glob)
await fastGlob('[!abc].js');  // ['d.js', 'z.js'] - excludes a,b,c
await glob('[!abc].js');      // ['d.js', 'z.js']
await globby('[!abc].js');    // ['d.js', 'z.js']
await tinyGlob('[!abc].js');  // ['d.js', 'z.js']

// tinyglobby behavior
await tinyglobby('[!abc].js'); // ['a.js', 'b.js', 'c.js'] - includes a,b,c instead
```

This differs from the [POSIX.1-2017 Pattern Matching Notation](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_13_01) specification, which defines `[!...]` as a **"non-matching list"**:

> "If an open bracket introduces a bracket expression as in XBD RE Bracket Expression, except that the <exclamation-mark> character ( '!' ) shall replace the <circumflex> character ( '^' ) in its role in a non-matching list in the regular expression notation"

This affects all negated character class patterns including ranges like `[!a-z]` and specific characters like `[!az]`.

[↑ Back to top](#feature-comparison-matrix)

---

### [5] tiny-glob empty negated class handling

`tiny-glob` handles empty negated character class `[!]` differently, returning all matching files instead of no matches:

```javascript
// Standard behavior (fast-glob, glob, globby, tinyglobby)
await fastGlob('[!].js');  // [] - empty negation set matches nothing

// tiny-glob behavior
await tinyGlob('[!].js');  // ['a.js', 'b.js', 'c.js', 'd.js', 'z.js'] - matches everything
```

[↑ Back to top](#feature-comparison-matrix)

---

### [6] tiny-glob caret negation inversion

`tiny-glob` inverts the logic for caret negation syntax `[^abc]`, returning matching characters instead of excluding them:

```javascript
// Standard behavior (fast-glob, glob, globby, tinyglobby, node:fs)
await fastGlob('[^abc].js');  // ['1.js', '2.js', '9.js', 'd.js', 'z.js'] - excludes a,b,c
await glob('[^abc].js');      // ['1.js', '2.js', '9.js', 'd.js', 'z.js']
await globby('[^abc].js');    // ['1.js', '2.js', '9.js', 'd.js', 'z.js']
await tinyglobby('[^abc].js'); // ['1.js', '2.js', '9.js', 'd.js', 'z.js']
await nodeFs('[^abc].js');    // ['1.js', '2.js', '9.js', 'd.js', 'z.js']

// tiny-glob behavior
await tinyGlob('[^abc].js');  // ['a.js', 'b.js', 'c.js'] - includes a,b,c instead
```

This affects both simple character lists and ranges like `[^a-c]`.

[↑ Back to top](#feature-comparison-matrix)

---

### [7] glob negated range case sensitivity

`glob` and `node:fs` show inconsistent case sensitivity behavior with negated ranges, particularly with `[!A-Z]` patterns:

```javascript
// Files: 1.js, 2.js, 9.js, a.js, b.js, c.js, d.js, z.js, A.js, B.js, C.js, Z.js

// Standard behavior (fast-glob, globby, tiny-glob, tinyglobby)
await fastGlob('[!A-Z].js');   // ['1.js', '2.js', '9.js', 'a.js', 'b.js', 'c.js', 'd.js', 'z.js']
await globby('[!A-Z].js');     // ['1.js', '2.js', '9.js', 'a.js', 'b.js', 'c.js', 'd.js', 'z.js']
await tinyGlob('[!A-Z].js');   // ['1.js', '2.js', '9.js', 'a.js', 'b.js', 'c.js', 'd.js', 'z.js']
await tinyglobby('[!A-Z].js'); // [] - inverted logic issue

// Inconsistent behavior (glob, node:fs)
await glob('[!A-Z].js');       // ['1.js', '2.js', '9.js'] - excludes lowercase letters
await nodeFs('[!A-Z].js');     // ['1.js', '2.js', '9.js'] - excludes lowercase letters
```

`glob` and `node:fs` exclude lowercase letters from `[!A-Z]` patterns when they should include them, suggesting case sensitivity handling issues in their negated range implementation.

[↑ Back to top](#feature-comparison-matrix)

---

### [8] tiny-glob question mark limitation

`tiny-glob` fails to recognize most question mark patterns as glob patterns due to its `globalyzer` dependency. The issue appears to be in the [globalyzer dependency](https://www.npmjs.com/package/globalyzer). In strict mode (default), the STRICT regex pattern doesn't recognize standalone `?` as a glob pattern:

```javascript
console.log(globalyzer('?.js'))       // { base: '.', glob: '?.js', isGlob: false }
console.log(globalyzer('file?.txt'))  // { base: '.', glob: 'file?.txt', isGlob: false }

console.log(globalyzer('?.js', { strict: false }))      // { base: '.', glob: '?.js', isGlob: true }
console.log(globalyzer('file?.txt', { strict: false })) // { base: '.', glob: 'file?.txt', isGlob: true }
```

The STRICT regex [`/\\(.)|(^!|\*|[\].+)]\?|...)/`](https://github.com/terkelg/globalyzer/blob/master/src/index.js#L3) only matches `?` after `]` but not standalone `?`. When `isGlob: false`, `tiny-glob` attempts to find a literal file instead of performing glob matching.

**Exception:** Patterns with dots like `?.?` work correctly, suggesting the regex handles dot-separated patterns differently.

```javascript
// Most patterns fail
await tinyGlob('?.js');     // [] - no matches
await tinyGlob('???.js');   // [] - no matches
await tinyGlob('?ar.txt');  // [] - no matches

// Exception: dot patterns work
await tinyGlob('?.?');      // ['a.b', '...'] - works correctly
```

[↑ Back to top](#feature-comparison-matrix)

---

### [9] Brace expansion result ordering

Libraries handle brace expansion result ordering differently:

```javascript
// fast-glob, globby: preserve brace order
await fastGlob('foo.{js,ts,css}');  // ['foo.js', 'foo.ts', 'foo.css']
await globby('foo.{js,ts,css}');    // ['foo.js', 'foo.ts', 'foo.css']

// tiny-glob, tinyglobby: alphabetical order
await tinyGlob('foo.{js,ts,css}');     // ['foo.css', 'foo.js', 'foo.ts']
await tinyglobby('foo.{js,ts,css}');   // ['foo.css', 'foo.js', 'foo.ts']
```

Speaking of order, do not forget about [[1]](#1-indeterminate-result-ordering).

[↑ Back to top](#feature-comparison-matrix)

---

### [10] tiny-glob numeric range limitation

`tiny-glob` doesn't support numeric range syntax in brace expansion. The [globrex dependency](https://www.npmjs.com/package/globrex) treats `..` as literal characters rather than range operators:

```javascript
// Supported by fast-glob, glob, globby, tinyglobby, node:fs
await fastGlob('file{1..3}.txt');   // ['file1.txt', 'file2.txt', 'file3.txt']
await glob('file{1..3}.txt');       // ['file1.txt', 'file2.txt', 'file3.txt']
await globby('file{1..3}.txt');     // ['file1.txt', 'file2.txt', 'file3.txt']
await tinyglobby('file{1..3}.txt'); // ['file1.txt', 'file2.txt', 'file3.txt']

// Not supported by tiny-glob
await tinyGlob('file{1..3}.txt');   // [] - no matches

// Comma-separated works in tiny-glob
await tinyGlob('file{1,2,3}.txt');  // ['file1.txt', 'file2.txt', 'file3.txt']
```

The globrex regex generation treats `{1..3}` as literal `(1\.\.3)` instead of expanding to `(1|2|3)`.

[↑ Back to top](#feature-comparison-matrix)

---

### [11] tinyglobby zero-padded range limitation

`tinyglobby` fails to match zero-padded numeric ranges while successfully handling simple ranges. The issue stems from the [picomatch dependency](https://www.npmjs.com/package/picomatch) where zero-padded ranges create invalid character class syntax:

```javascript
// Simple ranges work (fast-glob, glob, globby, tinyglobby, node:fs)
await fastGlob('file{1..3}.txt');   // ['file1.txt', 'file2.txt', 'file3.txt']
await tinyglobby('file{1..3}.txt'); // ['file1.txt', 'file2.txt', 'file3.txt']

// Zero-padded ranges fail in tinyglobby
await fastGlob('file{01..03}.txt');   // ['file01.txt', 'file02.txt', 'file03.txt']
await glob('file{01..03}.txt');       // ['file01.txt', 'file02.txt', 'file03.txt']
await globby('file{01..03}.txt');     // ['file01.txt', 'file02.txt', 'file03.txt']
await tinyglobby('file{01..03}.txt'); // [] - no matches

// tiny-glob fails on both
await tinyGlob('file{01..03}.txt');   // [] - no matches
```

Picomatch attempts to create character class `[01-03]` which is invalid regex syntax, causing fallback to literal string matching.

[↑ Back to top](#feature-comparison-matrix)

---

### [12] tiny-glob single item brace expansion

`tiny-glob` expands single-item braces while other libraries treat them as literal filenames:

```javascript
// Most libraries: treat as literal filename
await fastGlob('foo.{js}');   // ['foo.{js}'] - if literal file exists
await glob('foo.{js}');       // ['foo.{js}']
await globby('foo.{js}');     // ['foo.{js}']
await tinyglobby('foo.{js}'); // ['foo.{js}']

// tiny-glob: expands single-item braces
await tinyGlob('foo.{js}');   // ['foo.js'] - expands to foo.js
```

This behavior means `tiny-glob` will find `foo.js` when searching for `foo.{js}`, while other libraries look for a file literally named `foo.{js}`.

[↑ Back to top](#feature-comparison-matrix)

---

### [13] tiny-glob globstar ordering

`tiny-glob` returns globstar results in a different order compared to other libraries, prioritizing deeper nested files first:

```javascript
// Standard order (fast-glob, globby, tinyglobby)
await fastGlob('foo/**/*.js');  // ['foo/index.js', 'foo/main.js', 'foo/bar/component.js', ...]

// tiny-glob order
await tinyGlob('foo/**/*.js');  // ['foo/bar/baz/deep.js', 'foo/bar/baz/nested.js', 'foo/bar/component.js', ...]
```

[↑ Back to top](#feature-comparison-matrix)

---

### [14] Path separator differences on Windows

`glob`, `tiny-glob`, and `node:fs` return results with native Windows backslashes (`\`) while other libraries consistently return POSIX-style forward slashes (`/`), which is often more convenient for cross-platform development.

```javascript
// Windows results
await glob('foo/**/*.js');      // ['foo\\index.js', 'foo\\main.js', ...]
await tinyGlob('foo/**/*.js');   // ['foo\\bar\\baz\\deep.js', ...]
await nodeFs('foo/**/*.js');     // ['foo\\index.js', 'foo\\main.js', ...]

await fastGlob('foo/**/*.js');  // ['foo/index.js', 'foo/main.js', ...]
await globby('foo/**/*.js');    // ['foo/index.js', 'foo/main.js', ...]
await tinyglobby('foo/**/*.js'); // ['foo/index.js', 'foo/main.js', ...]
```

[↑ Back to top](#feature-comparison-matrix)

---

### [15] globby negated extglob limitation

`globby` has inconsistent behavior with extglob negation patterns starting with `!`. Patterns beginning with `!(...)` consistently return empty results, while the same logic works correctly when the negation is not at the start of the pattern.

```javascript
// Always fails: extglob negation at start
await globby('!(foo|bar).js')        // [] - empty result
await globby('!(test|app)*.js')      // [] - empty result
await globby('!(*.html)')            // [] - empty result
await globby('!(foo).js')            // [] - empty result

// Always works: extglob negation not at start
await globby('app.!(min).js')        // ['app.dev.js', 'app.prod.js'] - works correctly
await globby('test.!(spec).js')      // ['test.config.js', 'test.unit.js'] - works correctly
await globby('component.!(html)')    // ['component.jsx', 'component.vue'] - works correctly

// Mixed arrays: order matters
await globby(['*.js', '!(foo|bar).js'])    // Works - excludes foo.js, bar.js
await globby(['!(foo|bar).js', '*.js'])    // Broken - includes foo.js, bar.js
```

[↑ Back to top](#feature-comparison-matrix)

---

### [16] ExtGlob negation logic differences

Libraries handle `!(pattern)` negation differently when matching files that contain the pattern:

```javascript
// Standard exclusion logic (fast-glob, tiny-glob, tinyglobby)
await fastGlob('!(foo).js');   // ['bar.js'] - excludes files containing 'foo'
await tinyGlob('!(foo).js');   // ['bar.js'] - excludes files containing 'foo'
await tinyglobby('!(foo).js'); // ['bar.js'] - excludes files containing 'foo'

// Literal pattern matching (glob, node:fs)
await glob('!(foo).js');       // ['bar.js', 'foobar.js', 'foofoo.js'] - excludes only exact 'foo'
await nodeFs('!(foo).js');     // ['bar.js', 'foobar.js', 'foofoo.js'] - excludes only exact 'foo'
```

This represents different interpretations of how negation should work with partial matches.

[↑ Back to top](#feature-comparison-matrix)

---

### [17] tiny-glob hidden files behavior

`tiny-glob` includes hidden files (starting with `.`) in `*` pattern results, while other libraries exclude them:

```javascript
// Files: .hidden, foo.js, bar.txt

// Standard behavior (fast-glob, glob, globby, tinyglobby, node:fs)
await fastGlob('*');  // ['foo.js', 'bar.txt'] - excludes .hidden

// tiny-glob behavior
await tinyGlob('*');  // ['.hidden', 'foo.js', 'bar.txt'] - includes .hidden
```

[↑ Back to top](#feature-comparison-matrix)

---

### [18] Dot file handling differences

Libraries handle files ending with `.` differently in `*.*` patterns:

```javascript
// Files: file., file.., foo.js

// Include files ending with dot
await glob('*.*');     // ['file.', 'file..', 'foo.js']
await tinyGlob('*.*'); // ['file.', 'file..', 'foo.js']
await nodeFs('*.*');   // ['file.', 'file..', 'foo.js']

// Exclude files ending with single dot
await fastGlob('*.*');   // ['file..', 'foo.js'] - excludes file.
await globby('*.*');     // ['file..', 'foo.js'] - excludes file.
await tinyglobby('*.*'); // ['file..', 'foo.js'] - excludes file.
```

[↑ Back to top](#feature-comparison-matrix)

---

### [19] Case sensitivity differences

Libraries handle case sensitivity in file extensions differently:

```javascript
// Files: foo.js, MixedCase.Js, UPPERCASE.JS

// Case-sensitive matching
await fastGlob('*.js');   // ['foo.js'] - strict .js only
await globby('*.js');     // ['foo.js'] - strict .js only
await tinyGlob('*.js');   // ['foo.js'] - strict .js only
await tinyglobby('*.js'); // ['foo.js'] - strict .js only

// Case-insensitive matching
await glob('*.js');       // ['foo.js', 'MixedCase.Js', 'UPPERCASE.JS']
await nodeFs('*.js');     // ['foo.js', 'MixedCase.Js', 'UPPERCASE.JS']
```

[↑ Back to top](#feature-comparison-matrix)

---

### [20] tiny-glob hidden extension limitation

`tiny-glob` has inconsistent behavior with hidden files that have extensions when using `.*` patterns:

```javascript
// Files: .hidden, .config.js

// Standard behavior (fast-glob, glob, globby, tinyglobby, node:fs)
await fastGlob('.*');  // ['.hidden', '.config.js'] - finds both

// tiny-glob behavior
await tinyGlob('.*');  // ['.hidden'] - misses .config.js
```

[↑ Back to top](#feature-comparison-matrix)

---

### [21] Directory inclusion differences

Libraries differ in whether they include directories in globstar results:

```javascript
// Files and directories: foo/, foo/bar/, foo/bar/baz/, foo/index.js, foo/bar/component.js

// Files only (fast-glob, globby, tinyglobby)
await fastGlob('foo/**');   // ['foo/index.js', 'foo/bar/component.js'] - files only
await globby('foo/**');     // ['foo/index.js', 'foo/bar/component.js'] - files only
await tinyglobby('foo/**'); // ['foo/index.js', 'foo/bar/component.js'] - files only

// Files and directories (glob, tiny-glob, node:fs)
await glob('foo/**');       // ['foo', 'foo\\bar', 'foo\\bar\\baz', 'foo\\index.js', 'foo\\bar\\component.js']
await tinyGlob('foo/**');   // ['foo\\bar', 'foo\\bar\\baz', 'foo\\index.js', 'foo\\bar\\component.js']
await nodeFs('foo/**');     // ['foo', 'foo\\bar', 'foo\\bar\\baz', 'foo\\index.js', 'foo\\bar\\component.js']
```

This affects result counts and may impact applications that expect only files or need to handle directories separately.

[↑ Back to top](#feature-comparison-matrix)

---

### [22] Basename matching support

Only `fast-glob` and `glob` support basename matching, which allows matching filenames regardless of their directory path:

```javascript
// Files: index.js, foo/index.js, bar/index.js, foo/baz/index.js

// Libraries with basename matching support
await fastGlob('index.js', { baseNameMatch: true });  // ['index.js', 'foo/index.js', 'bar/index.js', 'foo/baz/index.js']
await glob('index.js', { matchBase: true });          // ['index.js', 'foo/index.js', 'bar/index.js', 'foo/baz/index.js']

// Libraries without basename matching support
await globby('index.js');     // ['index.js'] - only exact path match
await tinyGlob('index.js');   // ['index.js'] - only exact path match
await tinyglobby('index.js'); // ['index.js'] - only exact path match
await nodeFs('index.js');     // ['index.js'] - only exact path match
```

[↑ Back to top](#feature-comparison-matrix)

---

### [23] tiny-glob case sensitivity

`tiny-glob` shows more restrictive case sensitivity behavior compared to other libraries:

```javascript
// Files: foo.js, FOO.txt, MixedCase.css

// Pattern: *case*
await fastGlob('*case*');   // ['MixedCase.css']
await glob('*case*');       // ['MixedCase.css']
await globby('*case*');     // ['MixedCase.css']
await tinyglobby('*case*'); // ['MixedCase.css']

// tiny-glob is more restrictive
await tinyGlob('*case*');   // [] - no matches
```

This suggests `tiny-glob` has stricter case matching rules that may not follow standard glob behavior.

[↑ Back to top](#feature-comparison-matrix)

---

## References & Resources

### Library Documentation

- [`fast-glob`]
- [`glob`]
- [`globby`]
- [`tiny-glob`]
- [`tinyglobby`]
- [`node:fs`]

### Glob Pattern References

- [Glob Primer] - Introduction to glob patterns
- [Bash Manual - Pattern Matching] - Official Bash pattern matching documentation
- [Minimatch] - JavaScript glob matching library documentation
- [POSIX.1-2017 Pattern Matching] - Official POSIX pattern matching specification

### External Dependencies

- [globalyzer]
- [globrex]
- [picomatch]

---

<!-- Library links -->
[`fast-glob`]: https://github.com/mrmlnc/fast-glob
[`glob`]: https://github.com/isaacs/node-glob
[`globby`]: https://github.com/sindresorhus/globby
[`tiny-glob`]: https://github.com/terkelg/tiny-glob
[`tinyglobby`]: https://github.com/SuperchupuDev/tinyglobby
[`node:fs`]: https://nodejs.org/api/fs.html#fsglobpattern-options-callback

<!-- Documentation links -->
[Glob Primer]: https://github.com/isaacs/node-glob#glob-primer
[Bash Manual - Pattern Matching]: https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
[Minimatch]: https://github.com/isaacs/minimatch
[POSIX.1-2017 Pattern Matching]: https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_13_01

<!-- Dependency links -->
[globalyzer]: https://www.npmjs.com/package/globalyzer
[globrex]: https://www.npmjs.com/package/globrex
[picomatch]: https://www.npmjs.com/package/picomatch
