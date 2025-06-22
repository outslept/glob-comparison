import colors from "../utils/colors.js";
import type { GlobResult, LibraryName } from "./types.js";

type ExpectationResult = GlobResult[] | { error: string };

export class GlobExpectation {
  private isNegated = false;

  constructor(
    private readonly results: GlobResult[],
    private readonly library: LibraryName,
  ) {}

  get not(): GlobExpectation {
    const negated = new GlobExpectation(this.results, this.library);
    negated.isNegated = true;
    return negated;
  }

  private formatResults(): string[] {
    return this.results.map((r) => {
      if (typeof r === "string") return r;
      if (typeof r === "object" && r !== null) {
        const obj = r as Record<string, unknown>;
        return (obj.path as string) || (obj.name as string) || String(r);
      }
      return String(r);
    });
  }

  private createError(message: string): Error {
    return new Error(
      `${colors.red(this.library)}: ${message}\n` +
        `Actual: ${colors.cyan(JSON.stringify(this.formatResults(), null, 2))}`,
    );
  }

  toMatch(expected: string | string[]): this {
    const actual = this.formatResults();
    const expectedArray = Array.isArray(expected) ? expected : [expected];
    const matches = expectedArray.every((exp) =>
      actual.some((act) => act.includes(exp)),
    );

    if (matches !== !this.isNegated) {
      const verb = this.isNegated ? "NOT to match" : "to match";
      throw this.createError(
        `Expected ${verb} ${colors.yellow(JSON.stringify(expectedArray))}`,
      );
    }
    return this;
  }

  toHaveLength(expected: number): this {
    const actual = this.results.length;

    if ((actual === expected) !== !this.isNegated) {
      const verb = this.isNegated ? "NOT to have length" : "to have length";
      throw this.createError(
        `Expected ${verb} ${colors.yellow(String(expected))}, got ${colors.red(String(actual))}`,
      );
    }
    return this;
  }

  toContain(expected: string): this {
    const actual = this.formatResults();
    const contains = actual.includes(expected);

    if (contains !== !this.isNegated) {
      const verb = this.isNegated ? "NOT to contain" : "to contain";
      throw this.createError(
        `Expected ${verb} ${colors.yellow(`"${expected}"`)}`,
      );
    }
    return this;
  }

  toContainAll(expected: string[]): this {
    const actual = this.formatResults();
    const missing = expected.filter((exp) => !actual.includes(exp));
    const hasAll = missing.length === 0;

    if (hasAll !== !this.isNegated) {
      if (this.isNegated) {
        const found = expected.filter((exp) => actual.includes(exp));
        throw this.createError(
          `Expected NOT to contain all of ${colors.yellow(JSON.stringify(expected))}\n` +
            `  But found: ${colors.red(JSON.stringify(found))}`,
        );
      } else {
        throw this.createError(
          `Expected to contain all of ${colors.yellow(JSON.stringify(expected))}\n` +
            `  Missing: ${colors.red(JSON.stringify(missing))}`,
        );
      }
    }
    return this;
  }

  toBeEmpty(): this {
    const isEmpty = this.results.length === 0;

    if (isEmpty !== !this.isNegated) {
      const verb = this.isNegated ? "NOT to be empty" : "to be empty";
      throw this.createError(`Expected ${verb}`);
    }
    return this;
  }

  toMatchPattern(pattern: string): this {
    const actual = this.formatResults();
    const matches = actual.some((item) => new RegExp(pattern).test(item));

    if (matches !== !this.isNegated) {
      const verb = this.isNegated ? "NOT to match pattern" : "to match pattern";
      throw this.createError(`Expected ${verb} ${colors.yellow(pattern)}`);
    }
    return this;
  }
}

export class LibraryComparison {
  constructor(private readonly results: Map<LibraryName, ExpectationResult>) {}

  private formatComparison(): Record<string, string | string[]> {
    const formatted: Record<string, string | string[]> = {};

    for (const [lib, results] of this.results) {
      if ("error" in results) {
        formatted[lib] = `Error: ${results.error}`;
      } else {
        formatted[lib] = results.map((r) => {
          if (typeof r === "string") return r;
          if (typeof r === "object" && r !== null) {
            const obj = r as Record<string, unknown>;
            return (obj.path as string) || (obj.name as string) || String(r);
          }
          return String(r);
        });
      }
    }
    return formatted;
  }

  private createError(message: string): Error {
    const formatted = this.formatComparison();
    let output = `${colors.red("Library comparison failed")}: ${message}\n`;

    for (const [lib, results] of Object.entries(formatted)) {
      output += `  ${colors.bold(lib)}: ${colors.cyan(JSON.stringify(results))}\n`;
    }

    return new Error(output);
  }

  toHaveSameResults(): this {
    const libraries = Array.from(this.results.keys());
    const firstResults = JSON.stringify(this.results.get(libraries[0]));

    for (let i = 1; i < libraries.length; i++) {
      if (firstResults !== JSON.stringify(this.results.get(libraries[i]))) {
        throw this.createError("Expected all libraries to have same results");
      }
    }
    return this;
  }

  toHaveSameLength(): this {
    const libraries = Array.from(this.results.keys());
    const firstResult = this.results.get(libraries[0])!;
    const firstLength = "error" in firstResult ? 0 : firstResult.length;

    for (let i = 1; i < libraries.length; i++) {
      const currentResult = this.results.get(libraries[i])!;
      const currentLength = "error" in currentResult ? 0 : currentResult.length;

      if (firstLength !== currentLength) {
        throw this.createError(
          `Expected all libraries to return same number of results\n` +
            `  Expected: ${colors.yellow(String(firstLength))}\n` +
            `  Got: ${colors.red(String(currentLength))} (${libraries[i]})`,
        );
      }
    }
    return this;
  }

  toAllSucceed(): this {
    const failed = Array.from(this.results.entries())
      .filter(([, results]) => "error" in results)
      .map(
        ([lib, results]) => `${lib}: ${(results as { error: string }).error}`,
      );

    if (failed.length > 0) {
      throw this.createError(
        `Expected all libraries to succeed\nFailed: ${colors.red(failed.join(", "))}`,
      );
    }
    return this;
  }
}

export function expect(
  results: GlobResult[],
  library: LibraryName,
): GlobExpectation;
export function expect(
  results: Map<LibraryName, ExpectationResult>,
): LibraryComparison;
export function expect(
  results: GlobResult[] | Map<LibraryName, ExpectationResult>,
  library?: LibraryName,
): GlobExpectation | LibraryComparison {
  if (results instanceof Map) {
    return new LibraryComparison(results);
  }
  if (!library) {
    throw new Error("Library name is required when expecting GlobResult[]");
  }
  return new GlobExpectation(results, library);
}
