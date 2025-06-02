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
  // ...
};
