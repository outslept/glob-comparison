export function formatResults(files, maxLength = 40) {
  const isObjectArray =
    Array.isArray(files) &&
    files.length > 0 &&
    typeof files[0] === "object" &&
    files[0] !== null &&
    !Array.isArray(files[0]);

  if (isObjectArray) {
    return `${files.length} objects`;
  }

  if (files.length === 0) {
    return "∅";
  }

  const fullResult = files.join(", ");

  if (fullResult.length <= maxLength) {
    return fullResult;
  }

  let result = "";
  let count = 0;

  for (const file of files) {
    const addition = count === 0 ? file : `, ${file}`;
    const remaining = files.length - count;
    const withCounter = ` +${remaining}`;

    if ((result + addition + withCounter).length > maxLength) {
      result += withCounter;
      break;
    }

    result += addition;
    count++;
  }

  return result;
}

export function formatVerboseResults(files) {
  const isObjectArray =
    Array.isArray(files) &&
    files.length > 0 &&
    typeof files[0] === "object" &&
    files[0] !== null &&
    !Array.isArray(files[0]);

  if (isObjectArray) {
    return `${files.length} items (objects)`;
  }

  if (files.length === 0) {
    return "no matches";
  }

  if (files.length > 10) {
    return `${files.length} files`;
  }

  return files.join(", ");
}
