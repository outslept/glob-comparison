export const testDefinitions = {
  asterisk: {
    id: "asterisk",
    testName: "Asterisk Patterns",
    files: [
      "foo.js",
      "bar.js",
      "baz.txt",
      "qux.json",
      "config",
      "a",
      "ab",
      "abc",
      "abcdef",
      "foo_bar_baz.js",
      "start_end.txt",
      "x.y.z",
      "foo.bar.baz.with.dots.js",
      "short.js",
      "verylongfilename.txt",
    ],
    patterns: [
      "*",
      "*.js",
      "a*",
      "*.txt",
      "*.*",
      "*.*.*",
      "*.*.js",
      "*foo*",
      "*_*",
      "a*c",
      "foo*baz*",
      "***",
      "a*b*c",
      "*_*_*",
      "*.*.*.js",
    ],
  },

  character_classes: {
    testName: "Character Classes",
    id: "character_classes",
    files: [
      "a.js",
      "b.js",
      "c.js",
      "d.js",
      "z.js",
      "foo1.txt",
      "foo2.txt",
      "foo3.txt",
      "foo9.txt",
      "A.js",
      "B.js",
      "bar-.txt",
      "bar_.txt",
      "baz10.txt",
    ],
    patterns: [
      "[abc].js", // matches a.js, b.js, c.js
      "foo[123].txt", // matches foo1.txt, foo2.txt, foo3.txt
      "[a-c].js", // range test
      "[a-z].js", // full alphabet range
      "foo[0-9].txt", // digit range
      "[a-cA-C].js", // mixed case ranges
      "[az].js", // first and last without range
      "bar[-_].txt", // special chars in class
      "[9-1].txt", // should not match anything
    ],
  },

  negated_classes: {
    testName: "Negated Classes",
    files: [
      "a.js",
      "b.js",
      "c.js",
      "d.js",
      "z.js",
      "foo1.txt",
      "foo2.txt",
      "foo3.txt",
      "foo9.txt",
      "bar.js",
      "baz.js",
    ],
    patterns: [
      "[!abc].js", // should match: d.js, z.js, bar.js, baz.js
      "foo[!123].txt", // should match: foo9.txt
      "[!a-c].js", // should match: d.js, z.js, bar.js, baz.js
      "foo[!1-3].txt", // should match: foo9.txt
      "[!az].js", // should match: b.js, c.js, d.js, bar.js, baz.js
      "[!].js", // invalid - should test error handling
      "[!a-z].js", // should match nothing (all files have lowercase letters)
    ],
  },

  question_mark: {
    testName: "Question Mark",
    id: "question_mark",
    files: [
      "a.js",
      "foo.js",
      "bar.txt",
      "ab.js",
      "xy.txt",
      "baz.json",
      "x",
      "xy",
      "a.b",
      "toolong.js",
      ".hidden",
    ],
    patterns: [
      "?.js", // single char: a.js
      "???.js", // 3 chars: foo.js, baz.json (wrong ext)
      "??.js", // 2 chars: ab.js
      "foo?.txt", // no matches (foo.js exists)
      "ba?.txt", // no matches
      "?ar.txt", // bar.txt
      "?", // single char no ext: x
      "??", // 2 chars no ext: xy
      "?.?", // single.single: a.b
    ],
  },

  brace_expansion: {
    testName: "Brace Expansion",
    id: "brace_expansion",
    files: [
      "foo.js",
      "foo.ts",
      "foo.css",
      "bar.spec.js",
      "bar.test.js",
      "baz.json",
      "baz.yaml",
      "qux1.txt",
      "qux2.txt",
      "qux3.txt",
      "file01.txt",
      "file02.txt",
      "file03.txt",
      "foo.{js}",
      "nomatch.php",
    ],
    patterns: [
      "foo.{js,ts,css}",
      "bar.{spec,test}.js",
      "{foo,baz}.{js,json}",
      "foo.{js}",
      "qux{1..3}.txt",
      "qux{1,2,3}.txt",
      "file{01..03}.txt",
      "{foo,bar}.php",
      "foo.{}",
    ],
  },

  globstar: {
    testName: "Globstar Pattern",
    directories: [
      "foo",
      "foo/bar",
      "foo/bar/baz",
      "foo/qux",
      "bar",
      "bar/baz",
      "bar/qux/deep",
      "baz",
      "baz/nested/very/deep",
    ],
    files: [
      "foo.js",
      "bar.js",
      "baz.js",
      "foo/index.js",
      "foo/main.js",
      "foo/bar/component.js",
      "foo/bar/utils.js",
      "foo/bar/baz/deep.js",
      "foo/bar/baz/nested.js",
      "foo/qux/helper.js",
      "bar/config.js",
      "bar/setup.js",
      "bar/baz/test.js",
      "bar/baz/spec.js",
      "bar/qux/deep/buried.js",
      "baz/file.js",
      "baz/nested/mid.js",
      "baz/nested/very/deep/bottom.js",
    ],
    patterns: ["**/*.js", "foo/**/*.js", "**/bar/*.js", "**/nested/**/*.js"],
  },

  asterisk_pattern: {
    testName: "Extended Glob - Asterisk Pattern",
    files: [
      "foo.js",
      "foofoo.js",
      "foofoofoo.js",
      "bar.js",
      "test.js",
      "test.spec.js",
      "test.specspec.js",
      "app.js",
      "app.config.js",
      "app.configconfig.js",
      "nomatch.txt",
    ],
    patterns: [
      "*(foo).js", // foo.js, foofoo.js, foofoofoo.js
      "test.*(spec).js", // test.js, test.spec.js, test.specspec.js
      "*(foo|bar).js", // foo.js, bar.js, foofoo.js, foobar.js, etc
      "app.*(config).js", // app.js, app.config.js, app.configconfig.js
      "*(missing).js", // no matches
    ],
    options: { extglob: true },
  },

  at_pattern: {
    testName: "Extended Glob - At Pattern",
    files: [
      "foo.js",
      "bar.js",
      "baz.js",
      "qux.js",
      "foobar.js",
      "foobaz.js",
      "test.spec.js",
      "test.test.js",
      "app.config.js",
      "app.prod.js",
      "component.vue",
      "component.jsx",
      "component.tsx",
      "nomatch.php",
    ],
    patterns: [
      "@(foo|bar|baz).js", // foo.js, bar.js, baz.js
      "test.@(spec|test).js", // test.spec.js, test.test.js
      "app.@(config|prod).js", // app.config.js, app.prod.js
      "component.@(vue|jsx|tsx)", // component.vue, component.jsx, component.tsx
      "@(foo)baz.js", // foobaz.js
      "@(test|app).@(spec|config).js", // test.spec.js, app.config.js
      "@().js", // empty group - should match nothing
      "@(missing).js", // no matches
    ],
    options: { extglob: true },
  },
};
