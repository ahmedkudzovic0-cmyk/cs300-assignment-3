// 1. Validate: Checks if a record has a title and if minutes is a number.
// Returns an object with valid boolean and errors array. Does not change input.
export function validateRecord(record) {
  const errors = [];
  if (!record.title || record.title.trim() === "") errors.push("title is required and cannot be empty");
  if (typeof record.minutes !== "number") errors.push("minutes must be a number");
  return { valid: errors.length === 0, errors };
}

// 2. Normalize: Returns a cleaned copy with trimmed text. Does not change input.
export function normalizeRecord(record) {
  return {
    ...record,
    title: record.title ? record.title.trim() : "",
    creator: record.creator ? record.creator.trim() : "",
    category: record.category ? record.category.trim() : ""
  };
}

// 3. Filter: Returns records that match a condition. Does not change input.
export function filterRecords(records, condition) {
  return records.filter(condition);
}

// 4. Search: Matches text in title or creator, ignores capitalization. Does not change input.
export function searchRecords(records, query) {
  const q = query.toLowerCase();
  return records.filter(r =>
    (r.title && r.title.toLowerCase().includes(q)) ||
    (r.creator && r.creator.toLowerCase().includes(q))
  );
}

// 5. Sort: Returns a new sorted array by property. Tie-breaker is alphabetical by title. Does not change input.
export function sortRecords(records, property) {
  return [...records].sort((a, b) => {
    if (a[property] < b[property]) return -1;
    if (a[property] > b[property]) return 1;
    return a.title.localeCompare(b.title);
  });
}

// 6. Summarize: Returns count, totalMinutes, and averageMinutes. Does not change input.
export function summarizeRecords(records) {
  if (records.length === 0) return { count: 0, totalMinutes: 0, averageMinutes: null };
  const totalMinutes = records.reduce((sum, r) => sum + r.minutes, 0);
  return {
    count: records.length,
    totalMinutes: totalMinutes,
    averageMinutes: totalMinutes / records.length
  };
}

// 7. Report: Combines search and summarize. Does not change input.
export function buildReport(records, query) {
  const found = searchRecords(records, query);
  return {
    query: query,
    matches: found.length,
    summary: summarizeRecords(found)
  };
}
