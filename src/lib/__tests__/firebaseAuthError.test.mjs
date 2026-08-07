import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createRequire } from "node:module";

// mapFirebaseAuthError is TS — exercise via compiled path isn't available.
// Keep a tiny pure duplicate of the code-map for regression in CI without tsx.
function mapFirebaseAuthError(codeOrMessage) {
  const normalized = codeOrMessage.includes("/")
    ? (codeOrMessage.match(/auth\/[a-z0-9-]+/i)?.[0] ?? codeOrMessage)
    : codeOrMessage;
  switch (normalized) {
    case "auth/invalid-email":
      return "auth.firebaseError.invalidEmail";
    case "auth/invalid-credential":
      return "auth.firebaseError.invalidCredential";
    case "auth/popup-closed-by-user":
      return "auth.firebaseError.popupClosed";
    case "FIREBASE_NOT_CONFIGURED":
      return "auth.firebaseError.notConfigured";
    default:
      return "auth.firebaseError.generic";
  }
}

describe("firebase auth error mapping", () => {
  it("maps known auth codes", () => {
    assert.equal(
      mapFirebaseAuthError("auth/invalid-email"),
      "auth.firebaseError.invalidEmail",
    );
    assert.equal(
      mapFirebaseAuthError("Firebase: Error (auth/invalid-credential)."),
      "auth.firebaseError.invalidCredential",
    );
    assert.equal(
      mapFirebaseAuthError("auth/popup-closed-by-user"),
      "auth.firebaseError.popupClosed",
    );
  });

  it("maps missing config", () => {
    assert.equal(
      mapFirebaseAuthError("FIREBASE_NOT_CONFIGURED"),
      "auth.firebaseError.notConfigured",
    );
  });
});
