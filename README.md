# Feature Comparison

| Feature                    | `fast-glob` | `glob` | `globby` | `tiny-glob` | `tinyglobby` | Note                                                                                                                                                                                                                                            |
| -------------------------- | ----------- | ------ | -------- | ----------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic Patterns**         |             |        |          |             |              |                                                                                                                                                                                                                                                 |
| Asterisk (`*`)             | Y           | Y      | Y        | Y           | Y            | `glob`: results in indeterminate order, manual sorting required [\[1\]](#1-indeterminate-result-ordering). P.S. [\[1\]](#1-indeterminate-result-ordering) will be used throughout this table to indicate this same behavior                     |
| Character ranges (`[a-z]`) | Y           | Y      | Y        | Y           | Y            | [\[1\]](#1-indeterminate-result-ordering). `tiny-glob` throws error on invalid ranges [\[2\]](#2-tiny-glob-invalid-character-range-handling). Platform-dependent case sensitivity [\[3\]](#3-platform-dependent-case-sensitivity-behavior)      |
| Negated classes (`[!abc]`) | Y           | Y      | Y        | Y           | N            | [\[1\]](#1-indeterminate-result-ordering). `tinyglobby`: inverts negation logic [\[4\]](#4-tinyglobby-negated-character-classes-issue). `tiny-glob`: handles empty negated class incorrectly [\[5\]](#5-tiny-glob-empty-negated-class-handling) |


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

`tinyglobby` inverts the logic of negated character classes. Instead of excluding characters, it includes them:

```javascript
// Expected behavior (fast-glob, glob, globby, tiny-glob)
await fastGlob('[!abc].js');  // ['d.js', 'z.js'] - excludes a,b,c
await glob('[!abc].js');      // ['d.js', 'z.js']
await globby('[!abc].js');    // ['d.js', 'z.js']
await tinyGlob('[!abc].js');  // ['d.js', 'z.js']

// tinyglobby behavior (incorrect)
await tinyglobby('[!abc].js'); // ['a.js', 'b.js', 'c.js'] - includes a,b,c instead
```

This affects all negated character class patterns including ranges like `[!a-z]` and specific characters like `[!az]`.

[↑ Back to top](#feature-comparison)

---

### [5] tiny-glob empty negated class handling

`tiny-glob` incorrectly handles empty negated character class `[!]`, returning all matching files instead of no matches:

```javascript
// Expected behavior (fast-glob, glob, globby, tinyglobby)
await fastGlob('[!].js');  // [] - empty negation set matches nothing

// tiny-glob behavior (incorrect)
await tinyGlob('[!].js');  // ['a.js', 'b.js', 'c.js', 'd.js', 'z.js'] - matches everything
```

[↑ Back to top](#feature-comparison)

---
