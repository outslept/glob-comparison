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

export function formatResults(files: FileItem[]): string {
  if (isObjectArray(files)) {
    return `${files.length} items (objects)`;
  }
  if (!isStringArray(files)) {
      return `${files.length} mixed items`;
  }
  if (files.length === 0) {
    return "no matches";
  }

  return files.join(", ");
}
