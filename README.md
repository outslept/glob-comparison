# Feature Comparison

| Feature | fast-glob | glob | globby | tiny-glob | tinyglobby | Note |
|---------|-----------|------|--------|-----------|------------|------|
| **Core Glob Patterns** |
| Asterisk (`*`) | Y | Y | Y | Y | Y | |
| Question mark (`?`) | Y | Y | Y | N | Y | tiny-glob: globalyzer doesn't recognize ? as glob pattern [1] |
| Character classes (`[abc]`) | Y | Y | Y | Y | Y | |
| Character ranges (`[a-z]`) | Y | Y | Y | Y | Y | |
| Negated classes (`[!abc]`) | Y | Y | Y | Y | N | tinyglobby: returns inverted results for negated character classes [2] |
| **Advanced Patterns** |
| Globstar (`**`) | Y | Y | Y | Y | Y | |
| Nested globstar (`src/**/*.js`) | Y | Y | Y | Y | Y | |
| Mixed globstar (`**/components/*.js`) | Y | Y | Y | Y | Y | |
| Brace expansion (`{js,ts}`) | Y | Y | Y | Y | Y | |
| Nested brace expansion (`*.{spec,test}.js`) | Y | Y | Y | Y | Y | |
| Multiple brace expansion (`{app,config}.{js,json}`) | Y | Y | Y | Y | Y | |
| **Numeric Ranges** |
| Simple numeric range (`{1..3}`) | Y | Y | Y | N | Y | tiny-glob: returns empty results for all numeric ranges [3] |
| Zero-padded range (`{01..02}`) | Y | Y | Y | N | N | tiny-glob: no support; tinyglobby: fails on zero-padded patterns [4] |
| Plus (`+(pattern)`) | Y | Y | Y | Y | Y | One or more occurrences |
| Question (`?(pattern)`) | Y | Y | Y | Y | Y | Zero or one occurrence |
| Asterisk (`*(pattern)`) | Y | Y | Y | Y | Y | Zero or more occurrences |

<p align="right"> <samp> Y = Yes, N = No <br> Please verify the information listed and let me know if I am wrong with my findings. </samp> </p>

## Notes

[1] **tiny-glob question mark bug:**

Testing reveals the issue is in the [globalyzer dependency](https://www.npmjs.com/package/globalyzer). In strict mode (default), the STRICT regex pattern doesn't recognize standalone `?` as a glob pattern:

```javascript
const globalyzer = require('globalyzer');

// Fails in strict mode (default)
globalyzer('?.js')     // { base: '.', glob: '?.js', isGlob: false }
globalyzer('file?.txt') // { base: '.', glob: 'file?.txt', isGlob: false }

// Works in relaxed mode
globalyzer('?.js', { strict: false })     // { base: '.', glob: '?.js', isGlob: true }
globalyzer('file?.txt', { strict: false }) // { base: '.', glob: 'file?.txt', isGlob: true }
```

The STRICT regex `/\\(.)|(^!|\*|[\].+)]\?|...)/` only matches `?` after `]` but not standalone `?`. When `isGlob: false`, tiny-glob attempts to find a literal file instead of performing glob matching.

---

[2] **tinyglobby negated character classes bug:**

tinyglobby returns inverted results for negated character classes. Pattern `[!abc].js` should match files that do NOT start with 'a', 'b', or 'c', but tinyglobby returns exactly those files (a.js, b.js, c.js) instead of the expected matches (d.js, e.js).

This violates the POSIX glob standard where `[!characters]` means "any character NOT in the set". See [POSIX.1-2017 Pattern Matching Notation](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_13_01) section 2.13.1:

> "If an open bracket introduces a bracket expression as in XBD RE Bracket Expression, except that the <exclamation-mark> character ( '!' ) shall replace the <circumflex> character ( '^' ) in its role in a non-matching list in the regular expression notation"

---

[3] **tiny-glob numeric range limitation:**

tiny-glob returns empty results for all numeric range patterns like `{1..3}` or `{01..02}`. The [globrex dependency](https://www.npmjs.com/package/globrex) lacks support for numeric range expansion (`{start..end}` syntax) and only supports comma-separated alternatives (`{a,b,c}`).

```javascript
globrex('{1..3}', { extended: true })
// Returns: { regex: /^(1\.\.3)$/ } - literal dots, not range expansion

globrex('{1,2,3}', { extended: true })
// Returns: { regex: /^(1|2|3)$/ } - proper alternation
```

---

[4] **tinyglobby zero-padded range limitation:**

tinyglobby fails to match zero-padded numeric ranges like `{01..02}` while successfully handling simple ranges like `{1..3}`. The issue seems to come from the [picomatch dependency](https://www.npmjs.com/package/picomatch) where the `expandRange` function attempts to create a character class `[01-03]` which is invalid regex syntax. When this fails, picomatch falls back to literal string `01..03` instead of expanding to individual values `(01|02|03)`.

```javascript
picomatch.parse('{1..3}')
// Returns: { output: '[1-3]' }

picomatch.parse('{01..03}')
// Returns: { output: '01..03' } - literal fallback, not regex alternation
```

---
