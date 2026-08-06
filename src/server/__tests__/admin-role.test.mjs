import assert from "node:assert/strict";
import test from "node:test";

const ROLE_RANK = { user: 0, admin: 1, superAdmin: 2 };
function hasMinRole(role, minimum) {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

test("user cannot access admin", () => {
  assert.equal(hasMinRole("user", "admin"), false);
});

test("admin can access admin", () => {
  assert.equal(hasMinRole("admin", "admin"), true);
});

test("superAdmin satisfies admin minimum", () => {
  assert.equal(hasMinRole("superAdmin", "admin"), true);
});
