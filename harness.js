import * as tk from "./toolkit.js";
import { readFileSync } from "node:fs";

// Load the data
const books = JSON.parse(readFileSync("data/books.json", "utf8"));

// Helper to print PASS or FAIL
function check(name, expected, actual) {
  const result = JSON.stringify(actual) === JSON.stringify(expected) ? "PASS" : "FAIL";
  console.log(`[${result}] ${name} | Expected: ${JSON.stringify(expected)} | Actual: ${JSON.stringify(actual)}`);
}

// --- HARNESS CASES ---

// 1. Standard Validation
check("validate standard record", true, tk.validateRecord({title:"A", minutes:10}).valid);

// 2. Edge Case: Missing Property (Validation error)
check("validate missing property", false, tk.validateRecord({minutes:10}).valid);

// 3. Edge Case: Invalid Number (Validation error)
check("validate invalid number", false, tk.validateRecord({title:"A", minutes:"thirty"}).valid);

// 4. Normalization
check("normalize trims text", "Mina Reed", tk.normalizeRecord({title:"A", creator:" Mina Reed ", minutes:10}).creator);

// 5. Edge Case: Non-mutation (Save before, compare after)
const originalJson = JSON.stringify(books);
tk.normalizeRecord(books[0]);
tk.sortRecords(books, "minutes");
check("non-mutation check", originalJson, JSON.stringify(books));

// 6. Filter
check("filter by category", 2, tk.filterRecords(books, b => b.category === "Art").length);

// 7. Search (Standard)
check("search standard", 1, tk.searchRecords(books, "robot").length);

// 8. Edge Case: Different Capitalization (Search)
check("search ignores capitalization", 1, tk.searchRecords(books, "ROBOT").length);

// 9. Sort
check("sort by minutes", true, tk.sortRecords(books, "minutes")[0].minutes <= tk.sortRecords(books, "minutes")[1].minutes);

// 10. Edge Case: Equal Values (Tie-breaker)
check("sort tie-breaker works", true, tk.sortRecords([{title:"B", minutes:10}, {title:"A", minutes:10}], "minutes")[0].title === "A");

// 11. Summarize Standard
check("summarize standard", 8, tk.summarizeRecords(books).count);

// 12. Edge Case: Empty Array (Summarize)
check("summarize empty array", null, tk.summarizeRecords([]).averageMinutes);

// 13. Report
const report = tk.buildReport(books, "robot");
check("build report finds matches", 1, report.matches);
console.log("\n--- COMBINED REPORT OUTPUT ---");
console.log(report);
