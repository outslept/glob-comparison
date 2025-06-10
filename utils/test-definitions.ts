interface TestPattern {
  pattern: string | string[];
  options?: Record<string, unknown>;
}

export interface TestDefinition {
  id?: string;
  testName: string;
  files: string[];
  directories?: string[];
  patterns: (string | string[] | TestPattern)[];
  options?: Record<string, unknown>;
  platformSpecific?: string;
  needsSymlinks?: boolean;
  hiddenFiles?: string[];
}

export const testDefinitions: Record<string, TestDefinition> = {
  asterisk: {
    id: "asterisk",
    testName: "Asterisk Patterns",
    files: [
      "foo.js", "bar.js", "baz.txt", "qux.json",
      "config", "a", "ab", "abc", "abcdef",
      "foo_bar_baz.js", "start_end.txt",
      "x.y.z", "foo.bar.baz.with.dots.js",
      "short.js", "foobaz", "foo_baz",
      "foo.bar.baz", "fooXYZbaz", "verylongfilename.txt",
    ],
    patterns: [
      "*",
      "foo*",
      "*.js",
      "*config",
      "*bar*",
      "*_*",
      "*.*",
      "a*c",
      "foo*baz",
      "*.*.*",
      "*.*.js",
      "*a*b*",
      "*_*_*",
    ],
  },
  character_classes: {
    testName: "Character Classes",
    id: "character_classes",
    files: [
    "a.js", "b.js", "c.js", "d.js", "z.js",
    "A.js", "B.js", "C.js", "Z.js",
    "1.txt", "2.txt", "9.txt",
    "foo1.txt", "foo2.txt", "foo3.txt", "foo9.txt",
    "bar-.txt", "bar_.txt", "bar].txt", 'baz-qux.txt',
    "file[.txt", "test-.log", "baz10.txt",
    "mix3A.log", "empty.js", "dash.txt",
    ],
    patterns: [
    "[abc].js",
    "[a-c].js",
    "foo[1-3].txt",
    "[a-zA-Z].js",
    "[A-Z].js",
    "bar[-_].txt",
    "file[[]*.txt",
    "[[:alpha:]].js",
    "[[:digit:]].txt",
    "foo[[:digit:]].txt",
    "[[:upper:]].js",
    "[[:lower:]].js",
    "[[:alnum:]].txt",
    "[=a=].js",
    "[z].js",
    "[9-1].txt",
    "[].js",
    "bar[]_].txt",
    "baz[-q]*.txt",
    ],
  },
  negated_classes: {
    testName: "Negated Classes",
    files: [
      "a.js", "b.js", "c.js", "d.js", "z.js",
      "A.js", "B.js", "Z.js", "1.js", "9.js",
      "foo1.txt", "foo2.txt", "foo3.txt", "foo9.txt",
      "bar.js", "baz.js", "special-.txt", "test.log",
    ],
    patterns: [
      "[!abc].js",
      "[!a-c].js",
      "foo[!1-3].txt",
      "[!A-Z].js",
      "[!a-z].js",
      "[![:digit:]].js",
      "[![:upper:]].js",
      "[![:lower:]].js",
      "[^abc].js",
    ],
  },
  question_mark: {
    testName: "Question Mark",
    id: "question_mark",
    files: [
      "a.js", "foo.js", "bar.txt", "ab.js", "xy.txt",
      "baz.json", "x", "xy", "a.b", "toolong.js", ".hidden",
    ],
    patterns: [
      "?.js", "???.js", "??.js", "foo?.txt", "ba?.txt",
      "?ar.txt", "?", "??", "?.?",
    ],
  },
  brace_expansion: {
    testName: "Brace Expansion",
    id: "brace_expansion",
    files: [
      "foo.js", "foo.ts", "foo.css", "bar.spec.js", "bar.test.js",
      "baz.json", "baz.yaml", "qux1.txt", "qux2.txt", "qux3.txt",
      "file01.txt", "file02.txt", "file03.txt", "foo.{js}",
      "nomatch.php", "a-x-1.log", "a-y-1.log", "b-z-2.log",
    ],
    patterns: [
      "foo.{js,ts,css}", "bar.{spec,test}.js", "{foo,baz}.{js,json}",
      "foo.{js}", "qux{1..3}.txt", "qux{1,2,3}.txt", "file{01..03}.txt",
      "{foo,bar}.php", "foo.{}", "{a,b}-{x,y,z}-{1..2}.log",
    ],
  },
  globstar: {
    testName: "Globstar Pattern",
    directories: [
      "foo", "foo/bar", "foo/bar/baz", "foo/qux", "bar",
      "bar/baz", "bar/qux/deep", "baz", "baz/nested/very/deep",
    ],
    files: [
      "foo.js", "bar.js", "baz.js", "foo/index.js", "foo/main.js",
      "foo/bar/component.js", "foo/bar/utils.js", "foo/bar/baz/deep.js",
      "foo/bar/baz/nested.js", "foo/qux/helper.js", "bar/config.js",
      "bar/setup.js", "bar/baz/test.js", "bar/baz/spec.js",
      "bar/qux/deep/buried.js", "baz/file.js", "baz/nested/mid.js",
      "baz/nested/very/deep/bottom.js",
    ],
    patterns: [
      "**/*.js", "foo/**/*.js", "**/bar/*.js", "**/nested/**/*.js",
      "**", "foo/**", "**/baz/**/*.js", "foo/bar/baz/**",
    ],
  },
  asterisk_pattern: {
    testName: "Extended Glob - Asterisk Pattern",
    files: [
      "foo.js", "base.js", "foofoo.js", "foofoofoo.js", "bar.js",
      "test.js", "test.spec.js", "test.specspec.js", "app.js",
      "app.config.js", "app.configconfig.js", "nomatch.txt",
    ],
    patterns: [
      "*(foo).js", "test.*(spec).js", "*(foo|bar).js",
      "app.*(config).js", "*(missing).js", "*(foo|bar)base.js",
    ],
    options: { extglob: true },
  },
  at_pattern: {
    testName: "Extended Glob - At Pattern",
    files: [
      "foo.js", "bar.js", "baz.js", "qux.js", "foobar.js",
      "foobaz.js", "test.spec.js", "test.test.js", "app.config.js",
      "app.prod.js", "component.vue", "component.jsx", "component.tsx",
      "nomatch.php",
    ],
    patterns: [
      "@(foo|bar|baz).js", "test.@(spec|test).js", "app.@(config|prod).js",
      "component.@(vue|jsx|tsx)", "@(foo)baz.js",
      "@(test|app).@(spec|config).js", "@().js", "@(missing).js",
    ],
    options: { extglob: true },
  },
  exclamation_pattern: {
    testName: "Extended Glob - Exclamation Pattern",
    files: [
      "foo.js", "bar.js", "baz.js", "qux.js", "test.spec.js",
      "test.unit.js", "app.config.js", "app.prod.js", "component.vue",
      "component.jsx", "nomatch.txt",
    ],
    patterns: [
      "!(foo).js", "!(foo|bar).js", "test.!(spec).js", "app.!(config).js",
      "component.!(vue)", "!(test|app)*.js", "!(missing).js", "!(*.txt)",
    ],
    options: { extglob: true },
  },
  plus_pattern: {
    testName: "Extended Glob - Plus Pattern",
    files: [
      "foo.js", "foofoo.js", "foofoofoo.js", "bar.js", "test.spec.js",
      "test.specspec.js", "app.config.js", "app.configconfig.js",
      "empty.js", "nomatch.txt", "base.js",
    ],
    patterns: [
      "+(foo).js", "test.+(spec).js", "+(foo|bar).js", "app.+(config).js",
      "+(missing).js", "+(a|b|c).js", "+(foo|bar)base.js",
    ],
    options: { extglob: true },
  },
  question_pattern: {
    testName: "Extended Glob - Question Pattern",
    files: [
      "foo.js", "foofoo.js", "bar.js", "test.js", "test.spec.js",
      "app.js", "base.js", "app.config.js", "component.vue",
      "component.jsx", "nomatch.txt",
    ],
    patterns: [
      "?(foo).js", "test.?(spec).js", "?(foo|bar).js", "app.?(config).js",
      "component.?(vue|jsx)", "?(missing).js", "?(a|b|c).js",
      "?(foo|bar)base.js",
    ],
    options: { extglob: true },
  },
  absolute_paths: {
    testName: "Absolute Paths",
    files: [
      "foo.js", "bar.txt", "baz/qux.js", "baz/helper.txt",
      "nested/deep/file.js", "nested/config.json",
    ],
    directories: ["baz", "nested", "nested/deep"],
    patterns: ["*.js", "**/*.js", "baz/*", "**/nested/**/*", "**/*.{js,txt}"],
    options: { absolute: true },
  },
  relative_paths: {
    testName: "Relative Paths",
    files: [
      "foo.js", "bar.txt", "baz/qux.js", "baz/helper.txt",
      "nested/deep/file.js", "nested/config.json",
    ],
    directories: ["baz", "nested", "nested/deep"],
    patterns: ["*.js", "**/*.js", "baz/*", "**/nested/**/*", "**/*.{js,txt}"],
    options: { absolute: false },
  },
  string_output: {
    testName: "String Output Mode",
    files: ["foo.js", "bar.txt", "baz/qux.js", "nested/file.json"],
    directories: ["baz", "nested"],
    patterns: ["*.js", "**/*", "baz/*"],
    options: { objectMode: false },
  },
  depth_limiting: {
    testName: "Depth Limiting",
    id: "depth_limiting",
    directories: ["foo", "foo/bar", "foo/bar/baz", "foo/bar/baz/qux"],
    files: [
      "root.js", "foo/level1.js", "foo/bar/level2.js",
      "foo/bar/baz/level3.js", "foo/bar/baz/qux/level4.js",
    ],
    patterns: [
      { pattern: "**/*.js", options: {} },
      { pattern: "**/*.js", options: { depth: 1 } },
      { pattern: "**/*.js", options: { depth: 2 } },
      { pattern: "**/*.js", options: { depth: 3 } },
    ],
  },
  basename_matching: {
    testName: "Basename Matching",
    id: "basename_matching",
    directories: ["foo", "bar", "foo/baz"],
    files: [
      "index.js", "foo/index.js", "bar/index.js", "foo/baz/index.js",
      "config.json", "foo/config.json",
    ],
    patterns: [
      { pattern: "index.js", options: { matchBase: false } },
      { pattern: "index.js", options: { matchBase: true } },
      { pattern: "config.json", options: { matchBase: false } },
      { pattern: "config.json", options: { matchBase: true } },
    ],
  },
  case_sensitivity: {
    testName: "Case Sensitivity",
    id: "case_sensitivity",
    files: ["foo.js", "FOO.txt", "Bar.json", "BAR.xml", "MixedCase.css"],
    patterns: [
      { pattern: "foo.*", options: { caseSensitive: true } },
      { pattern: "foo.*", options: { caseSensitive: false } },
      { pattern: "FOO.*", options: { caseSensitive: true } },
      { pattern: "FOO.*", options: { caseSensitive: false } },
      { pattern: "*case*", options: { caseSensitive: true } },
      { pattern: "*case*", options: { caseSensitive: false } },
    ],
  },
  windows_drive_letters: {
    testName: "Windows Drive Letters",
    id: "windows_drive_letters",
    files: ["foo.js", "bar.txt", "baz/qux.js"],
    directories: ["baz"],
    patterns: ["*.js", "**/*.js", "baz/*"],
    options: { absolute: true },
    platformSpecific: "win32",
  },
  unc_paths: {
    testName: "UNC Paths",
    id: "unc_paths",
    files: ["shared.js", "config.json", "data/file.txt"],
    directories: ["data"],
    patterns: ["*.js", "**/*", "data/*"],
    options: { absolute: true },
    platformSpecific: "win32",
  },
  symlinks: {
    testName: "Symbolic Links",
    id: "symlinks",
    directories: ["foo", "bar"],
    files: ["foo/real.js", "foo/config.json", "bar/app.js", "target.txt"],
    patterns: [
      { pattern: "**/*.js", options: { followSymbolicLinks: false } },
      { pattern: "**/*.js", options: { followSymbolicLinks: true } },
      { pattern: "foo/*", options: { followSymbolicLinks: false } },
      { pattern: "foo/*", options: { followSymbolicLinks: true } },
      { pattern: "**/target.txt", options: { followSymbolicLinks: false } },
      { pattern: "**/target.txt", options: { followSymbolicLinks: true } },
    ],
    needsSymlinks: true,
  },
  windows_hidden_files: {
    testName: "Windows Hidden Files",
    id: "windows_hidden_files",
    files: [
      "visible.js", "normal.txt", "system.log",
      "hidden.js", "secret.txt",
    ],
    hiddenFiles: ["hidden.js", "secret.txt"],
    patterns: ["*", "*.js", "*.txt", "hidden.*", "secret.*"],
    platformSpecific: "win32",
  },
};
