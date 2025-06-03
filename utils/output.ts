/* eslint-disable no-console */
import { Table } from "console-table-printer";

export interface LibraryResult {
  library: string;
  count: number;
  results: string;
  error?: string;
}

type TestResults = Map<string, LibraryResult[]>;

function normalizeResult(res: LibraryResult): string {
  return res.error ? `❌ Error: ${res.error}` : res.results;
}

export function outputVerbose(results: TestResults): void {
  for (const [pattern, libResults] of results) {
    console.log(`\n${pattern}:`);
    for (const res of libResults) {
      console.log(`  ${res.library}: ${normalizeResult(res)}`);
    }
  }
}

export function outputCompact(results: TestResults): void {
  const table = new Table({
    columns: [
      { name: "pattern", title: "Pattern", alignment: "left", maxLen: 12 },
      { name: "library", title: "Library", alignment: "left", maxLen: 12 },
      { name: "count", title: "Count", alignment: "center", maxLen: 5 },
      { name: "results", title: "Results", alignment: "left", maxLen: 50 },
    ],
  });

  for (const [pattern, libResults] of results) {
    libResults.forEach((res, i) => {
      table.addRow({
        pattern: i === 0 ? pattern : "",
        library: res.library,
        count: res.error ? "❌" : res.count,
        results: normalizeResult(res),
      });
    });
    table.addRow({ pattern: "", library: "", count: "", results: "" });
  }

  table.printTable();
}

export function outputSummary(testName: string, results: TestResults): void {
  console.log(`\n=== ${testName} Summary ===`);

  const table = new Table({
    columns: [
      { name: "pattern", title: "Pattern", alignment: "left", maxLen: 15 },
      {
        name: "identical",
        title: "All Same?",
        alignment: "center",
        maxLen: 10,
      },
      { name: "count", title: "Count", alignment: "center", maxLen: 5 },
      {
        name: "differences",
        title: "Differences",
        alignment: "left",
        maxLen: 40,
      },
    ],
  });

  for (const [pattern, libResults] of results) {
    const normalizedResults = libResults.map(normalizeResult);
    const counts = libResults.map((r) => (r.error ? "error" : r.count));

    const sameCount = new Set(counts).size === 1;
    const sameResults = new Set(normalizedResults).size === 1;
    const identical = sameCount && sameResults;

    const unique = [...new Set(normalizedResults)];
    const diffs = identical
      ? "none"
      : unique.length <= 2
        ? unique.join(" vs ")
        : `${unique.length} different results`;

    const hasErrors = libResults.some((r) => r.error);
    const countDisplay = sameCount && !hasErrors ? counts[0] : "varies";

    table.addRow({
      pattern,
      identical: identical ? "✅" : "❌",
      count: countDisplay,
      differences: diffs,
    });
  }

  table.printTable();
}
