type FileItem = string | object;

function isObjectArray(files: FileItem[]): files is object[] {
  return (
    files.length > 0 &&
    typeof files[0] === "object" &&
    files[0] !== null &&
    !Array.isArray(files[0])
  );
}

function isStringArray(files: FileItem[]): files is string[] {
  return files.length === 0 || typeof files[0] === "string";
}

export function formatResults(files: FileItem[], maxLen: number = 40): string {
  if (isObjectArray(files)) return `${files.length} objects`;
  if (files.length === 0) return "∅";

  if (!isStringArray(files)) {
    return `${files.length} mixed items`;
  }

  const full = files.join(", ");
  if (full.length <= maxLen) return full;

  let result = "";
  let count = 0;

  for (const file of files) {
    const add = count === 0 ? file : `, ${file}`;
    const remaining = files.length - count;
    const counter = ` +${remaining}`;

    if (count === 0) {
      const minFirstShow = Math.min(file.length, maxLen - counter.length - 3); // -3 for "..."
      if (minFirstShow > 0) {
        const truncatedFirst =
          file.length > minFirstShow
            ? `${file.slice(0, minFirstShow)}...`
            : file;

        if ((truncatedFirst + counter).length <= maxLen) {
          return truncatedFirst + counter;
        }
      }
    }

    if ((result + add + counter).length > maxLen) {
      return result + counter;
    }

    result += add;
    count++;
  }

  return result;
}

export function formatVerboseResults(files: FileItem[]): string {
  if (isObjectArray(files)) return `${files.length} items (objects)`;
  if (files.length === 0) return "no matches";
  if (files.length > 10) return `${files.length} files`;

  if (!isStringArray(files)) {
    return `${files.length} mixed items`;
  }

  return files.join(", ");
}
