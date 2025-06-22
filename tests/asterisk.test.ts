import { expect } from "../api/expect.js";
import {
  afterEach,
  beforeEach,
  describe,
  test,
  TestContext,
  withFiles,
} from "../api/test-api.js";

describe("Asterisk Patterns", () => {
  let ctx: TestContext;

  beforeEach(() => {
    ctx = new TestContext(
      "asterisk",
      withFiles([
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
        "foobaz",
        "foo_baz",
        "foo.bar.baz",
        "fooXYZbaz",
        "verylongfilename.txt",
      ]),
    );
    ctx.setup();
  });

  afterEach(() => ctx.cleanup());

  test("should match all files with *", async () => {
    expect(await ctx.glob("fast-glob", "*"), "fast-glob").toHaveLength(19);
  });

  test("should match files starting with foo using foo*", async () => {
    expect(await ctx.glob("fast-glob", "foo*"), "fast-glob")
      .toContainAll([
        "foo.js",
        "foo_bar_baz.js",
        "foobaz",
        "foo_baz",
        "foo.bar.baz",
        "foo.bar.baz.with.dots.js",
        "fooXYZbaz",
      ])
      .not.toContain("bar.js");
  });

  test("should match JS files with *.js", async () => {
    expect(await ctx.glob("fast-glob", "*.js"), "fast-glob")
      .toContainAll([
        "foo.js",
        "bar.js",
        "foo_bar_baz.js",
        "foo.bar.baz.with.dots.js",
        "short.js",
      ])
      .not.toContain("baz.txt");
  });

  test("should match files ending with config using *config", async () => {
    expect(await ctx.glob("fast-glob", "*config"), "fast-glob").toContain(
      "config",
    );
  });

  test("should match files containing bar using *bar*", async () => {
    expect(await ctx.glob("fast-glob", "*bar*"), "fast-glob").toContainAll([
      "bar.js",
      "foo_bar_baz.js",
      "foo.bar.baz",
      "foo.bar.baz.with.dots.js",
    ]);
  });

  test("should match files with underscores using *_*", async () => {
    expect(await ctx.glob("fast-glob", "*_*"), "fast-glob").toContainAll([
      "foo_bar_baz.js",
      "start_end.txt",
      "foo_baz",
    ]);
  });

  test("should match files with dots using *.*", async () => {
    expect(await ctx.glob("fast-glob", "*.*"), "fast-glob").toContainAll([
      "foo.js",
      "bar.js",
      "baz.txt",
      "qux.json",
      "start_end.txt",
      "x.y.z",
    ]);
  });

  test("should match pattern a*c (starts with 'a', ends with 'c')", async () => {
    expect(await ctx.glob("fast-glob", "a*c"), "fast-glob")
      .toContain("abc")
      .not.toContain("abcdef");
  });

  test("should match pattern foo*baz", async () => {
    expect(await ctx.glob("fast-glob", "foo*baz"), "fast-glob").toContainAll([
      "foobaz",
      "foo_baz",
      "foo.bar.baz",
      "fooXYZbaz",
    ]);
  });

  test("should compare libraries for basic asterisk patterns", async () => {
    expect(await ctx.globAll(["fast-glob", "glob", "globby"], "*.js"))
      .toAllSucceed()
      .toHaveSameLength();
  });
});
