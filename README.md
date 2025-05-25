# Feature Comparison

| Feature | fast-glob | glob | globby | tiny-glob | tinyglobby | Note |
|---------|-----------|------|--------|-----------|------------|------|
| **Core Glob Patterns** |
| Asterisk (`*`) | Y | Y | Y | Y | Y | |
| Question mark (`?`) | Y | Y | Y | N | Y | tiny-glob: globalyzer doesn't recognize ? as glob pattern [1] |
| Character classes (`[abc]`) | Y | Y | Y | Y | Y | |
| Character ranges (`[a-z]`) | Y | Y | Y | Y | Y | |

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

