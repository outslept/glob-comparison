/* eslint-disable no-console */
import process from "node:process";
import { cleanupTestEnvironment, createTestEnvironment } from "./utils/file.js";
import { formatResults, formatVerboseResults } from "./utils/formatters.js";
import { outputCompact, outputVerbose } from "./utils/output.js";
import { getFiles } from "./utils/runner.js";
import { testDefinitions } from "./utils/test-definitions.js";

const libraries = [
  { name: "fast-glob", pkg: "fast-glob" },
  { name: "glob", pkg: "glob" },
  { name: "globby", pkg: "globby" },
  { name: "tiny-glob", pkg: "tiny-glob" },
  { name: "tinyglobby", pkg: "tinyglobby" },
];

async function runSingleTest(testConfig, options = {}) {
  const { verbose = false } = options;
  const { tempDir, testDir } = createTestEnvironment(testConfig);

  testConfig.setup?.(testDir);

  const originalCwd = process.cwd();
  process.chdir(testDir);

  try {
    const results = new Map();

    for (const patternConfig of testConfig.patterns) {
      const [pattern, patternOptions] =
        typeof patternConfig === "string" || Array.isArray(patternConfig)
          ? [patternConfig, testConfig.options || {}]
          : patternConfig.pattern
            ? [
                patternConfig.pattern,
                { ...(testConfig.options || {}), ...patternConfig.options },
              ]
            : [patternConfig, testConfig.options || {}];

      const patternStr = Array.isArray(pattern) ? pattern.join(", ") : pattern;
      const libraryResults = [];

      for (const lib of libraries) {
        try {
          const module = await import(lib.pkg);
          const files = await getFiles(
            lib.name,
            module,
            pattern,
            patternOptions,
          );

          const resultsStr = verbose
            ? formatVerboseResults(files)
            : formatResults(files);

          libraryResults.push({
            library: lib.name,
            count: files.length,
            results: resultsStr,
            rawFiles: files,
          });
        } catch (error) {
          libraryResults.push({
            library: lib.name,
            count: "❌",
            results: verbose
              ? `Error: ${error.message}`
              : `Error: ${error.message.slice(0, 30)}...`,
            error: error.message,
          });
        }
      }

      results.set(patternStr, libraryResults);
    }

    if (verbose) {
      outputVerbose(results);
    } else {
      outputCompact(results);
    }
  } finally {
    process.chdir(originalCwd);
    cleanupTestEnvironment(tempDir);
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    mode: "compact",
    testIds: [],
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === "--verbose" || arg === "-v") {
      options.verbose = true;
    } else if (arg === "--test" || arg === "-t") {
      options.testIds.push(args[++i]);
    } else if (arg === "--help" || arg === "-h") {
      console.log(`
Usage: node run-tests.js [options]

Options:
  -v, --verbose     Use verbose output format
  -t, --test <id>   Run specific test by ID (can be used multiple times)
  -h, --help        Show this help

Available test IDs:
${Object.keys(testDefinitions)
  .map((id) => `  ${id}`)
  .join("\n")}

Examples:
  node run-tests.js                    # Run all tests in compact mode
  node run-tests.js --verbose          # Run all tests in verbose mode
  node run-tests.js -t asterisk        # Run only asterisk test
  node run-tests.js -v -t asterisk -t character_classes  # Run specific tests in verbose mode
      `);
      process.exit(0);
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  console.log(`\nRunning tests on ${process.platform} platform`);
  console.log(`Output mode: ${options.verbose ? "verbose" : "compact"}\n`);

  const testsToRun =
    options.testIds.length > 0
      ? options.testIds.map((id) => testDefinitions[id]).filter(Boolean)
      : Object.values(testDefinitions);

  if (testsToRun.length === 0) {
    console.error("No valid tests found!");
    process.exit(1);
  }

  console.log(`Total tests: ${testsToRun.length}`);

  for (const test of testsToRun) {
    await runSingleTest(test, options);
  }
}

main().catch(console.error);
