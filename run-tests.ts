/* eslint-disable no-console */
import process from "node:process";
import { TestRunner } from "./api/runner.js";
import type { TestSuite } from "./api/types.js";

interface ParsedArgs {
  testFiles: string[];
  pattern?: string;
  help: boolean;
}

function parseArgs(): ParsedArgs {
  const args = process.argv.slice(2);
  const options: ParsedArgs = {
    testFiles: [],
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--help" || arg === "-h") {
      options.help = true;
    } else if (arg === "--pattern" || arg === "-p") {
      options.pattern = args[++i];
    } else if (arg.endsWith(".test.ts")) {
      options.testFiles.push(arg);
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
Usage: tsx run-tests.ts [options] [test-files...]

Options:
  -h, --help           Show this help
  -p, --pattern <glob> Run tests matching pattern

Examples:
  tsx run-tests.ts                           # Run all *.test.ts files
  tsx run-tests.ts basic.test.ts             # Run specific test file
  tsx run-tests.ts -p "glob*"                # Run tests matching pattern
  `);
}

async function loadTestFiles(files: string[]): Promise<TestSuite[]> {
  globalThis.__testSuites = [];

  for (const file of files) {
    try {
      await import(`./${file}`);
    } catch (error) {
      console.error(`Failed to load test file ${file}:`, error);
    }
  }

  return globalThis.__testSuites || [];
}

async function findTestFiles(): Promise<string[]> {
  const { glob } = await import("fast-glob");
  return await glob("**/*.{test,spec}.ts", {
    ignore: ["node_modules/**", "dist/**"],
  });
}

async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  let testFiles = options.testFiles;

  if (testFiles.length === 0) {
    testFiles = await findTestFiles();
  }

  if (options.pattern) {
    const pattern = new RegExp(options.pattern);
    testFiles = testFiles.filter((file) => pattern.test(file));
  }

  if (testFiles.length === 0) {
    console.log("No test files found!");
    return;
  }

  const suites = await loadTestFiles(testFiles);

  if (suites.length === 0) {
    console.log("No test suites found!");
    return;
  }

  const runner = new TestRunner();
  await runner.runSuites(suites);
}

main().catch(console.error);
