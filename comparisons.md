## Comprehensive Feature Comparison

| Feature | fast-glob | glob | globby | tiny-glob | tinyglobby | Issues | PR | Note |
|---------|-----------|------|--------|-----------|------------|--------|-----|------|
| **Basic Glob Patterns** |
| Asterisk (`*`) | Y | Y | Y | Y | Y | | | |
| Question mark (`?`) | Y | Y | Y | N | Y | | | tiny-glob doesn't support `?` pattern |
| Character classes (`[abc]`) | Y | Y | Y | Y | Y | | | |
| Character ranges (`[a-z]`) | Y | Y | Y | Y | Y | | | |
| Negated classes (`[!abc]`) | Y | Y | Y | Y | Y | | | |
| Globstar (`**`) | Y | Y | Y | Y | Y | | | |
| Brace expansion (`{a,b}`) | Y | Y | Y | Y | Y | | | |
| Numeric ranges (`{1..3}`) | Y | Y | Y | Y | Y | | | |
| **Extended Glob (ExtGlob)** |
| Plus (`+(pattern)`) | Y | Y | Y | Y | Y | | | One or more |
| Question (`?(pattern)`) | Y | Y | Y | Y | Y | | | Zero or one |
| Asterisk (`*(pattern)`) | Y | Y | Y | Y | Y | | | Zero or more |
| At (`@(pattern)`) | Y | Y | Y | Y | Y | | | Exactly one |
| Exclamation (`!(pattern)`) | Y | Y | Y | Y | Y | | | Not matching |
| **Negation & Ignore** |
| Negation patterns (`!pattern`) | Y | N | Y | N | Y | | | glob v6+ removed, tiny-glob no arrays |
| Basic ignore option | Y | Y | Y | Y | Y | | | |
| .gitignore file support | Y | Y | Y | Y | Y | | | All have basic support |
| Custom ignore files | Y | Y | Y | Y | Y | | | |
| Multiple ignore files | N | N | Y | N | N | | | |
| **API Types** |
| Async/Promise API | Y | Y | Y | Y | Y | | | |
| Sync API | Y | Y | Y | N | Y | | | |
| Stream API | Y | Y | N | N | N | | | |
| Iterator API | N | Y | N | N | N | | | |
| Callback API | N | N | N | N | N | | | Legacy style |
| **Input Patterns** |
| Single pattern (string) | Y | Y | Y | Y | Y | | | |
| Multiple patterns (array) | Y | Y | Y | N | Y | | | |
| Mixed positive/negative | Y | N | Y | N | Y | | | |
| **Output Formats** |
| String paths | Y | Y | Y | Y | Y | | | |
| Object mode (with stats) | Y | Y | Y | N | N | | | |
| Absolute paths | Y | Y | Y | Y | Y | | | |
| Relative paths | Y | Y | Y | Y | Y | | | |
| Mark directories (`/`) | Y | N | Y | N | Y | | | |
| **Filtering Options** |
| Files only | Y | Y | Y | Y | Y | | | |
| Directories only | Y | Y | Y | Y | Y | | | |
| Both files and directories | Y | Y | Y | Y | Y | | | |
| Dot files inclusion | Y | Y | Y | Y | Y | | | |
| Hidden files (Windows) | Y | Y | Y | ? | Y | | | |
| **Path Handling** |
| Cross-platform paths | Y | Y | Y | Y | Y | | | |
| Windows drive letters | Y | Y | Y | ? | N | | | tinyglobby limitation |
| UNC paths (Windows) | Y | Y | Y | ? | ? | | | |
| Symbolic links following | Y | Y | Y | N | Y | | | |
| Broken symlinks handling | Y | Y | Y | N | Y | | | |
| **Pattern Matching Control** |
| Case sensitivity control | Y | Y | Y | Y | Y | | | |
| Basename matching | Y | Y | Y | Y | Y | | | |
| Depth limiting | Y | Y | Y | Y | Y | | | |
| **Bundle Impact** |
| Package size | 35kb | 87kb | 12kb | 4kb | 8kb | | | |
| Dependencies count | 17 | 10 | 23 | 2 | 2 | | | |

## Migration Notes

### From globby to tinyglobby
- ✅ Set `expandDirectories: false` to match fast-glob's default behavior
- ❌ Multiple ignore files not supported
- ❌ Some advanced gitignore features may differ

### From glob to others
- ❌ Iterator API only in glob
- ❌ Negation patterns removed in glob v6+
- ❌ Directory marking doesn't work in glob

### From fast-glob to others
- ✅ Most compatible across libraries
- ❌ Object mode not in tiny-glob/tinyglobby
- ❌ Stream API only in fast-glob/glob

### From tiny-glob to others
- ❌ No sync API
- ❌ No multiple patterns support
- ❌ Limited glob pattern support (`?` missing)

## Known Limitations

### tinyglobby
- ❌ Cross-drive globs: `["C:/*.js", "F:/*.js"]`
- ❌ Windows backslashes: requires forward slashes only
- ❌ Some advanced ExtGlob patterns

### tiny-glob
- ❌ Question mark pattern: `file?.js`
- ❌ Pattern arrays: `["*.js", "*.ts"]`
- ❌ Synchronous operations

### glob
- ❌ Negation in v6+: `["*.js", "!test.js"]`
- ❌ Directory marking inconsistent

### All Libraries
- ❌ Browser support (Node.js only)
- ❌ Real-time file watching (use chokidar)
- ❌ Network paths (except UNC on Windows)
