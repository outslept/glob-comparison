import { getFiles } from "../utils/runner.js";
import type { AnyGlobOptions } from "../utils/options.js";
import type { GlobResult, LibraryName } from "./types.js";

export async function compareLibraries(
  libraries: LibraryName[],
  pattern: string | string[],
  options: AnyGlobOptions = {},
): Promise<Map<LibraryName, GlobResult[] | { error: string }>> {
  const results = new Map<LibraryName, GlobResult[] | { error: string }>();

  for (const lib of libraries) {
    try {
      const module = await import(lib);
      results.set(lib, await getFiles(lib, module, pattern, options));
    } catch (error) {
      results.set(lib, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}
