# Feature Comparison

| Feature                    | `fast-glob` | `glob` | `globby` | `tiny-glob` | `tinyglobby` | Note                                                                                                                                                                                                                                            |
| -------------------------- | ----------- | ------ | -------- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic Patterns**         |             |        |          |             |              |                                                                                                                                                                                                                                                 |
| Asterisk (`*`)             | Y           | Y      | Y        | Y           | Y            | `glob`: results in indeterminate order, manual sorting required [\[1\]](#1-indeterminate-result-ordering). P.S. [\[1\]](#1-indeterminate-result-ordering) will be used throughout this table to indicate this same behavior                     |
| Character ranges (`[a-z]`) | Y           | Y      | Y        | Y           | Y            | [\[1\]](#1-indeterminate-result-ordering). `tiny-glob` throws error on invalid ranges [\[2\]](#2-tiny-glob-invalid-character-range-handling). Platform-dependent case sensitivity [\[3\]](#3-platform-dependent-case-sensitivity-behavior)      |
| Negated classes (`[!abc]`) | Y           | Y      | Y        | Y           | N            | [\[1\]](#1-indeterminate-result-ordering). `tinyglobby`: inverts negation logic [\[4\]](#4-tinyglobby-negated-character-classes-issue). `tiny-glob`: handles empty negated class incorrectly [\[5\]](#5-tiny-glob-empty-negated-class-handling) |
| Question mark (`?`)                                 | Y         | Y    | Y      | N         | Y          | [\[1\]](#1-indeterminate-result-ordering). `tiny-glob`: doesn't recognize most `?` patterns as globs [\[6\]](#6-tiny-glob-question-mark-limitation) |
| **Brace Expansion**                                 |           |      |        |           |            |                                                                                                                                                                                 |
| Brace expansion (`{js,ts}`)                         | Y         | Y    | Y      | Y         | Y          | [\[1\]](#1-indeterminate-result-ordering). Result ordering varies [\[7\]](#7-brace-expansion-result-ordering) |
| Nested brace expansion (`*.{spec,test}.js`)         | Y         | Y    | Y      | Y         | Y          | [\[1\]](#1-indeterminate-result-ordering) |
| Multiple brace expansion (`{app,config}.{js,json}`) | Y         | Y    | Y      | Y         | Y          | [\[1\]](#1-indeterminate-result-ordering) |
| Simple numeric range (`{1..3}`)                     | Y         | Y    | Y      | N         | Y          | [\[1\]](#1-indeterminate-result-ordering). `tiny-glob`: no support for numeric ranges [\[8\]](#8-tiny-glob-numeric-range-limitation) |
| Zero-padded range (`{01..03}`)                      | Y         | Y    | Y      | N         | N          | [\[1\]](#1-indeterminate-result-ordering). `tiny-glob`: no support [\[8\]](#8-tiny-glob-numeric-range-limitation). `tinyglobby`: fails on zero-padded patterns [\[9\]](#9-tinyglobby-zero-padded-range-limitation) |
| Single item braces (`{js}`)                         | Literal   | Literal | Literal | Expands   | Literal    | `tiny-glob`: expands single-item braces [\[10\]](#10-tiny-glob-single-item-brace-expansion) |

## References

- **[Glob Primer]**
- **[Bash Manual - Pattern Matching]**
- **[Minimatch]**

<!-- Library links -->
[`fast-glob`]: https://github.com/mrmlnc/fast-glob
[`glob`]: https://github.com/isaacs/node-glob
[`globby`]: https://github.com/sindresorhus/globby
[`tiny-glob`]: https://github.com/terkelg/tiny-glob
[`tinyglobby`]: https://github.com/SuperchupuDev/tinyglobby

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

## Notes

### [1] Indeterminate Result Ordering

Starting from `glob` v9, results are returned in non-deterministic order that depends on your filesystem, operating system, disk controller, ..., - they may appear consistently reverse-alphabetical on some systems but this **behavior** is not guaranteed across different environments. Unlike `glob` v8 which automatically sorted results using English locale, you need to manually sort if you depend on consistent ordering. To sort results just as version 8 did, use:

```javascript
glob.sync('pattern').sort((a, b) => a.localeCompare(b, 'en'))
```

**Reference links:**

1. https://github.com/isaacs/node-glob/issues/576
2. https://github.com/isaacs/node-glob/blob/v8.1.0/common.js?rgh-link-date=2024-03-01T08%3A48%3A35.000Z#L20

[↑ Back to top](#feature-comparison)

---

### [2] tiny-glob invalid character range handling

tiny-glob throws an error encountering invalid character ranges (like [9-1] where the start character has a higher ASCII value than the end character), while other libraries gracefully return no matches.

```javascript
// All other libraries handle gracefully
await fastGlob('[9-1].txt');  // []
await glob.glob('[9-1].txt'); // []
await globby('[9-1].txt');    // []
await tinyglobby('[9-1].txt'); // []

// tiny-glob throws error
await tinyGlob('[9-1].txt');
// Error: Invalid regular expression: /^[9-1]\.txt$/: Range out of order in character class
```

[↑ Back to top](#feature-comparison)

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

[↑ Back to top](#feature-comparison)

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

[↑ Back to top](#feature-comparison)

---

### [5] tiny-glob empty negated class handling

`tiny-glob`  handles empty negated character class `[!]` differently, returning all matching files instead of no matches:

```javascript
// Standard behavior (fast-glob, glob, globby, tinyglobby)
await fastGlob('[!].js');  // [] - empty negation set matches nothing

// tiny-glob behavior
await tinyGlob('[!].js');  // ['a.js', 'b.js', 'c.js', 'd.js', 'z.js'] - matches everything
```

[↑ Back to top](#feature-comparison)

---

### [6] tiny-glob question mark limitation

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

[↑ Back to top](#feature-comparison)

---

### [7] Brace expansion differences

Libraries handle brace expansion result ordering differently:

```javascript
// fast-glob, globby: preserve brace order
await fastGlob('foo.{js,ts,css}');  // ['foo.js', 'foo.ts', 'foo.css']
await globby('foo.{js,ts,css}');    // ['foo.js', 'foo.ts', 'foo.css']

// tiny-glob, tinyglobby: alphabetical order
await tinyGlob('foo.{js,ts,css}');     // ['foo.css', 'foo.js', 'foo.ts']
await tinyglobby('foo.{js,ts,css}');   // ['foo.css', 'foo.js', 'foo.ts']
```

[↑ Back to top](#feature-comparison)

---

### [8] tiny-glob numeric range limitation

`tiny-glob` doesn't support numeric range syntax in brace expansion. The [globrex dependency](https://www.npmjs.com/package/globrex) treats `..` as literal characters rather than range operators:

```javascript
// Supported by fast-glob, glob, globby, tinyglobby
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

### [9] tinyglobby zero-padded range limitation

`tinyglobby` fails to match zero-padded numeric ranges while successfully handling simple ranges. The issue stems from the [picomatch dependency](https://www.npmjs.com/package/picomatch) where zero-padded ranges create invalid character class syntax:

```javascript
// Simple ranges work (fast-glob, glob, globby, tinyglobby)
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

[↑ Back to top](#feature-comparison)
___

### [10] tiny-glob single item brace expansion

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

[↑ Back to top](#feature-comparison)

---
