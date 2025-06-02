/* eslint-disable no-console */
import { Table } from "console-table-printer";

export function outputVerbose(results) {
  for (const [pattern, libraryResults] of results) {
    console.log(`\n${pattern}:`);

    for (const result of libraryResults) {
      const status = result.error ? `❌ ${result.error}` : result.results;
      console.log(`  ${result.library}: ${status}`);
    }
  }
}

export function outputCompact(results) {
  const table = new Table({
    columns: [
      { name: "pattern", title: "Pattern", alignment: "left", maxLen: 12 },
      { name: "library", title: "Library", alignment: "left", maxLen: 12 },
      { name: "count", title: "Count", alignment: "center", maxLen: 5 },
      { name: "results", title: "Results", alignment: "left", maxLen: 50 },
    ],
  });

  const patterns = Array.from(results.keys());

  for (const pattern of patterns) {
    const libraryResults = results.get(pattern);

    for (const [i, result] of libraryResults.entries()) {
      table.addRow({
        pattern: i === 0 ? pattern : "",
        library: result.library,
        count: result.count,
        results: result.results,
      });
    }

    table.addRow({
      pattern: "",
      library: "",
      count: "",
      results: "",
    });
  }

  table.printTable();
}

export function outputSummary(testName, results) {
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

  for (const [pattern, libraryResults] of results) {
    const counts = libraryResults.map((r) => r.count);
    const results_strings = libraryResults.map((r) => r.results);

    const allSameCount = new Set(counts).size === 1;
    const allSameResults = new Set(results_strings).size === 1;
    const allIdentical = allSameCount && allSameResults;

    let differences = "";
    if (!allIdentical) {
      const uniqueResults = [...new Set(results_strings)];
      if (uniqueResults.length <= 2) {
        differences = uniqueResults.join(" vs ");
      } else {
        differences = `${uniqueResults.length} different results`;
      }
    }

    table.addRow({
      pattern,
      identical: allIdentical ? "✅" : "❌",
      count: allSameCount ? counts[0] : "varies",
      differences: differences || "none",
    });
  }

  table.printTable();
}
