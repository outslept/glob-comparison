function Run-Test {
    param($file, $category)

    $testPath = "tests\$category\$file"
    if (Test-Path $testPath) {
        node $testPath
        Write-Host "Completed: $file"
    } else {
        Write-Host "File not found: $testPath"
    }

    Write-Host ""
    Read-Host "Press Enter to continue"
    Write-Host ""
}

Write-Host "Starting tests..."
Write-Host "Platform: Windows"
Write-Host ""

Write-Host "=== BASIC TESTS ==="
Run-Test "asterisk.js" "basic"
Run-Test "character-classes.js" "basic"
Run-Test "character-ranges.js" "basic"
Run-Test "negated-classes.js" "basic"
Run-Test "question-mark.js" "basic"

Write-Host "=== BRACE EXPANSION TESTS ==="
Run-Test "brace-expansion.js" "brace-expansion"
Run-Test "numeric-ranges.js" "brace-expansion"

Write-Host "=== EXTGLOB TESTS ==="
Run-Test "asterisk-pattern.js" "extglob"
Run-Test "at-pattern.js" "extglob"
Run-Test "exclamation-pattern.js" "extglob"
Run-Test "plus-pattern.js" "extglob"
Run-Test "question-pattern.js" "extglob"

Write-Host "=== GLOBSTAR TESTS ==="
Run-Test "globstar.js" "globstar"

Write-Host "=== IGNORE TESTS ==="
Run-Test "custom-ignore.js" "ignore"
Run-Test "gitignore-support.js" "ignore"
Run-Test "ignore-option.js" "ignore"
Run-Test "mixed-positive-negatives.js" "ignore"
Run-Test "multiple-ignore-files.js" "ignore"
Run-Test "negation-patterns.js" "ignore"

Write-Host "=== OPTIONS TESTS ==="
Run-Test "absolute-paths.js" "options"
Run-Test "case-sensitivity-control.js" "options"
Run-Test "depth-limiting.js" "options"
Run-Test "directories-only.js" "options"
Run-Test "dot-files-inclusion.js" "options"
Run-Test "files-and-directories.js" "options"
Run-Test "files-only.js" "options"
Run-Test "mark-directories.js" "options"
Run-Test "object-mode-with-stats.js" "options"

Write-Host "=== PATTERNS TESTS ==="
Run-Test "basename-matching.js" "patterns"
Run-Test "multi-pattern.js" "patterns"
Run-Test "relative-paths.js" "patterns"
Run-Test "single-pattern.js" "patterns"
Run-Test "string-paths.js" "patterns"

Write-Host "=== PLATFORM TESTS ==="
Run-Test "hidden-files-windows.js" "platform"
Run-Test "unc-paths.js" "platform"
Run-Test "windows-drive-letters.js" "platform"

Write-Host "All tests completed!"
