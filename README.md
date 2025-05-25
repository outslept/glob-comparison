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

## Notes

[1] **tiny-glob question mark bug:**

Testing reveals the potential issue is in the [globalyzer dependency](https://www.npmjs.com/package/globalyzer). It incorrectly identifies `?` patterns as non-glob:

```javascript
globalyzer('?.js')     // { base: '.', glob: '?.js', isGlob: false }
globalyzer('file?.txt') // { base: '.', glob: 'file?.txt', isGlob: false }
globalyzer('?')        // { base: '.', glob: '?', isGlob: false }

// For comparison:
globalyzer('*.js')     // { base: '.', glob: '*.js', isGlob: true }
globalyzer('**/*.js')  // { base: '.', glob: '**/*.js', isGlob: true }
```

When `isGlob: false`, tiny-glob attempts to find a literal file named `?.js` instead of performing glob matching, resulting in empty results.

[2] **tinyglobby negated character classes bug:**

tinyglobby returns inverted results for negated character classes. Pattern `[!abc].js` should match files that do NOT start with 'a', 'b', or 'c', but tinyglobby returns exactly those files (a.js, b.js, c.js) instead of the expected matches (d.js, e.js).

This violates the POSIX glob standard where `[!characters]` means "any character NOT in the set". See [POSIX.1-2017 Pattern Matching Notation](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html#tag_18_13_01) section 2.13.1:

> "If an open bracket introduces a bracket expression as in XBD RE Bracket Expression, except that the <exclamation-mark> character ( '!' ) shall replace the <circumflex> character ( '^' ) in its role in a non-matching list in the regular expression notation"
