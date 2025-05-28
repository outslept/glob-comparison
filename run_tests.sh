#!/bin/bash

run_tests() {
  local file=$1
  local category=$2

  echo "Running: ${category}/${file}"

  if [ -f "tests/${category}/${file}" ]; then
    node "tests/${category}/${file}"
    echo "Completed: ${file}"
  else
    echo "File not found: tests/${category}/${file}"
  fi

  echo ""
  read -p "Press enter to continue..."
  echo "
}

echo "Starting Tests..."
echo "Platform: $(uname -s)"
echo ""

echo "=== BASIC TESTS ==="
run_test "asterisk.js" "basic"
run_test "character-classes.js" "basic"
run_test "character-ranges.js" "basic"
run_test "negated-classes.js" "basic"
run_test "question-mark.js" "basic"

echo "=== BRACE EXPANSION TESTS ==="
run_test "brace-expansion.js" "brace-expansion"
run_test "numeric-ranges.js" "brace-expansion"

echo "=== EXTGLOB TESTS ==="
run_test "asterisk-pattern.js" "extglob"
run_test "at-pattern.js" "extglob"
run_test "exclamation-pattern.js" "extglob"
run_test "plus-pattern.js" "extglob"
run_test "question-pattern.js" "extglob"

echo "=== GLOBSTAR TESTS ==="
run_test "globstar.js" "globstar"

echo "=== IGNORE TESTS ==="
run_test "custom-ignore.js" "ignore"
run_test "gitignore-support.js" "ignore"
run_test "ignore-option.js" "ignore"
run_test "mixed-positive-negatives.js" "ignore"
run_test "multiple-ignore-files.js" "ignore"
run_test "negation-patterns.js" "ignore"

echo "=== OPTIONS TESTS ==="
run_test "absolute-paths.js" "options"
run_test "case-sensitivity-control.js" "options"
run_test "depth-limiting.js" "options"
run_test "directories-only.js" "options"
run_test "dot-files-inclusion.js" "options"
run_test "files-and-directories.js" "options"
run_test "files-only.js" "options"
run_test "mark-directories.js" "options"
run_test "object-mode-with-stats.js" "options"

echo "=== PATTERNS TESTS ==="
run_test "basename-matching.js" "patterns"
run_test "multi-pattern.js" "patterns"
run_test "relative-paths.js" "patterns"
run_test "single-pattern.js" "patterns"
run_test "string-paths.js" "patterns"

echo "=== PLATFORM TESTS ==="
run_test "hidden-files-windows.js" "platform"
run_test "unc-paths.js" "platform"
run_test "windows-drive-letters.js" "platform"

echo "All tests completed!"
