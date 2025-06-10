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

export function printResults(results: TestResults): void {
  for (const [pattern, libResults] of results) {
    console.log(`\nPattern: ${pattern}`);
    for (const res of libResults) {
      console.log(`  - ${res.library}: ${normalizeResult(res)}`);
    }
  }
}
