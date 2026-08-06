import assert from "node:assert/strict";
import test from "node:test";

function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = line.split(",");
    const row = {};
    headers.forEach((header, index) => {
      row[header] = cells[index] ?? "";
    });
    return row;
  });
}

test("csv template parses fishing demo row", () => {
  const csv = [
    "id,name_ko,address,latitude,longitude,record_status",
    "spot-demo,데모,부산,35.24,129.21,active",
  ].join("\n");
  const rows = parseCsv(csv);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, "spot-demo");
  assert.equal(Number(rows[0].latitude) > 30, true);
});

test("forbidden ugly seafood term detected", () => {
  const forbidden = /못난이|ugly\s*seafood/i;
  assert.equal(forbidden.test("못난이 수산물"), true);
  assert.equal(forbidden.test("수산시장"), false);
});
