/* eslint-disable no-console */
import process from "node:process";
import colors from "../utils/colors.js";
import { TestSkipError } from "./test-api.js";
import type { TestCase, TestStats, TestSuite } from "./types.js";

export class TestRunner {
  private stats: TestStats = {
    passed: 0,
    failed: 0,
    skipped: 0,
    total: 0,
  };
  private startTime = Date.now();

  async runSuites(suites: TestSuite[]): Promise<void> {
    console.log(colors.bold("\nRunning tests...\n"));

    for (const suite of suites) {
      await this.runSuite(suite, 0);
    }

    this.printSummary();
  }

  private async runSuite(suite: TestSuite, depth = 0): Promise<void> {
    const indent = "  ".repeat(depth);
    console.log(`${indent}${colors.bold(suite.name)}`);

    for (const hook of suite.hooks.beforeAll) {
      await hook();
    }

    try {
      const hasOnly = this.hasOnlyTests(suite);

      for (const item of suite.tests) {
        if (item.type === "describe") {
          await this.runSuite(item, depth + 1);
        } else if (item.type === "test") {
          if (hasOnly && !item.only) continue;
          await this.runTest(item, suite, depth + 1);
        }
      }
    } finally {
      for (const hook of suite.hooks.afterAll) {
        await hook();
      }
    }

    if (depth === 0) console.log();
  }

  private hasOnlyTests(suite: TestSuite): boolean {
    for (const item of suite.tests) {
      if (item.type === "test" && item.only) return true;
      if (item.type === "describe" && this.hasOnlyTests(item)) return true;
    }
    return false;
  }

  private async runTest(
    test: TestCase,
    suite: TestSuite,
    depth: number,
  ): Promise<void> {
    const indent = "  ".repeat(depth);
    this.stats.total++;

    if (test.skip) {
      console.log(`${indent}${colors.yellow("S")} ${test.name}`);
      this.stats.skipped++;
      return;
    }

    const testStartTime = Date.now();

    try {
      for (const hook of suite.hooks.beforeEach) {
        await hook();
      }

      await test.fn();

      for (const hook of suite.hooks.afterEach) {
        await hook();
      }

      const testDuration = Date.now() - testStartTime;
      const durationStr =
        testDuration > 100
          ? colors.yellow(`${testDuration}ms`)
          : `${testDuration}ms`;

      console.log(
        `${indent}${colors.green("P")} ${test.name} (${durationStr})`,
      );
      this.stats.passed++;
    } catch (error) {
      if (error instanceof TestSkipError) {
        console.log(
          `${indent}${colors.yellow("S")} ${test.name} (${error.message})`,
        );
        this.stats.skipped++;
      } else {
        console.log(`${indent}${colors.red("F")} ${test.name}`);
        this.printErrorDetails(
          error instanceof Error ? error.message : String(error),
          `${indent}  `,
        );
        this.stats.failed++;
      }

      try {
        for (const hook of suite.hooks.afterEach) {
          await hook();
        }
      } catch (hookError) {
        console.log(`${indent}  ${colors.red("Hook error:")} ${hookError}`);
      }
    }
  }

  private printErrorDetails(errorMessage: string, indent: string): void {
    errorMessage.split("\n").forEach((line) => {
      if (line.trim()) console.log(`${indent}${colors.red(line)}`);
    });
  }

  private printSummary(): void {
    const duration = Date.now() - this.startTime;
    const durationStr =
      duration > 1000 ? `${(duration / 1000).toFixed(2)}s` : `${duration}ms`;

    console.log(colors.bold("Test Results:"));
    console.log(`  Total: ${this.stats.total}`);
    console.log(`  ${colors.green("Passed:")} ${this.stats.passed}`);

    if (this.stats.failed > 0) {
      console.log(`  ${colors.red("Failed:")} ${this.stats.failed}`);
    }

    if (this.stats.skipped > 0) {
      console.log(`  ${colors.yellow("Skipped:")} ${this.stats.skipped}`);
    }

    console.log(`  Time: ${durationStr}`);

    if (this.stats.failed > 0) {
      console.log(`\n${colors.red("Tests failed!")}`);
      process.exit(1);
    } else if (this.stats.total === 0) {
      console.log(`\n${colors.yellow("No tests found!")}`);
    } else {
      console.log(`\n${colors.green("All tests passed!")}`);
      if (this.stats.skipped > 0) {
        console.log(`${this.stats.skipped} tests skipped`);
      }
    }

    console.log();
  }

  getStats(): TestStats {
    return { ...this.stats };
  }
}
