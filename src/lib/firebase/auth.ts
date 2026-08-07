import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

export type FirebaseAuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
};

const CALLBACK_KEY = "padopado.firebase.callbackUrl";
const PENDING_GOOGLE_KEY = "padopado.firebase.googlePending";

export function toFirebaseAuthUser(user: User): FirebaseAuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerId: user.providerData[0]?.providerId ?? "firebase",
  };
}

function googleProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  provider.addScope("email");
  provider.addScope("profile");
  return provider;
}

async function ensurePersistence() {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("FIREBASE_NOT_CONFIGURED");
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch {
    // Ignore persistence errors (private mode); auth can still work.
  }
  return auth;
}

function preferRedirect(): boolean {
  if (typeof window === "undefined") return true;
  if (process.env.NEXT_PUBLIC_STATIC_EXPORT === "1") return true;
  const ua = window.navigator.userAgent;
  // Mobile / in-app browsers often break Firebase popups.
  return /Android|iPhone|iPad|iPod|Mobile|Instagram|FBAN|FBAV|Kakao/i.test(ua);
}

export function rememberAuthCallback(callbackUrl: string) {
  try {
    sessionStorage.setItem(CALLBACK_KEY, callbackUrl || "/my");
  } catch {
    // ignore
  }
}

export function consumeAuthCallback(fallback = "/my"): string {
  try {
    const value = sessionStorage.getItem(CALLBACK_KEY);
    sessionStorage.removeItem(CALLBACK_KEY);
    return value || fallback;
  } catch {
    return fallback;
  }
}

export function subscribeFirebaseAuth(
  onChange: (user: FirebaseAuthUser | null) => void,
): Unsubscribe | null {
  const auth = getFirebaseAuth();
  if (!auth) {
    onChange(null);
    return null;
  }
  return onAuthStateChanged(auth, (user) => {
    onChange(user ? toFirebaseAuthUser(user) : null);
  });
}

/** Completes Google redirect flow after returning to the app. */
export async function completeGoogleRedirect(): Promise<FirebaseAuthUser | null> {
  const auth = await ensurePersistence();
  const result = await getRedirectResult(auth);
  try {
    sessionStorage.removeItem(PENDING_GOOGLE_KEY);
  } catch {
    // ignore
  }
  if (!result?.user) return null;
  return toFirebaseAuthUser(result.user);
}

export async function signInWithGoogle(
  callbackUrl = "/my",
): Promise<FirebaseAuthUser | "redirecting"> {
  const auth = await ensurePersistence();
  const provider = googleProvider();
  rememberAuthCallback(callbackUrl);

  if (preferRedirect()) {
    try {
      sessionStorage.setItem(PENDING_GOOGLE_KEY, "1");
    } catch {
      // ignore
    }
    await signInWithRedirect(auth, provider);
    return "redirecting";
  }

  try {
    const result = await signInWithPopup(auth, provider);
    return toFirebaseAuthUser(result.user);
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String((error as { code: string }).code)
        : "";
    // Popup blocked / closed / COOP issues → fall back to full-page redirect.
    if (
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/internal-error" ||
      code === "auth/network-request-failed"
    ) {
      try {
        sessionStorage.setItem(PENDING_GOOGLE_KEY, "1");
      } catch {
        // ignore
      }
      await signInWithRedirect(auth, provider);
      return "redirecting";
    }
    throw error;
  }
}

/** @deprecated use signInWithGoogle */
export async function signInWithGooglePopup(): Promise<FirebaseAuthUser> {
  const result = await signInWithGoogle("/my");
  if (result === "redirecting") {
    throw new Error("auth/redirecting");
  }
  return result;
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<FirebaseAuthUser> {
  const auth = await ensurePersistence();
  const result = await signInWithEmailAndPassword(auth, email, password);
  return toFirebaseAuthUser(result.user);
}

export async function registerWithEmailPassword(
  email: string,
  password: string,
): Promise<FirebaseAuthUser> {
  const auth = await ensurePersistence();
  const result = await createUserWithEmailAndPassword(auth, email, password);
  return toFirebaseAuthUser(result.user);
}

export async function signOutFirebase(): Promise<void> {
  const auth = getFirebaseAuth();
  if (!auth) return;
  await firebaseSignOut(auth);
}

export function firebaseAuthReady(): boolean {
  return isFirebaseConfigured();
}

export function mapFirebaseAuthError(codeOrMessage: string): string {
  const normalized = codeOrMessage.includes("/")
    ? (codeOrMessage.match(/auth\/[a-z0-9-]+/i)?.[0] ?? codeOrMessage)
    : codeOrMessage;
  switch (normalized) {
    case "auth/invalid-email":
      return "auth.firebaseError.invalidEmail";
    case "auth/user-disabled":
      return "auth.firebaseError.userDisabled";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "auth.firebaseError.invalidCredential";
    case "auth/email-already-in-use":
      return "auth.firebaseError.emailInUse";
    case "auth/weak-password":
      return "auth.firebaseError.weakPassword";
    case "auth/popup-closed-by-user":
      return "auth.firebaseError.popupClosed";
    case "auth/popup-blocked":
    case "auth/cancelled-popup-request":
      return "auth.firebaseError.popupBlocked";
    case "auth/network-request-failed":
      return "auth.firebaseError.network";
    case "auth/unauthorized-domain":
      return "auth.firebaseError.unauthorizedDomain";
    case "auth/operation-not-allowed":
      return "auth.firebaseError.operationNotAllowed";
    case "auth/account-exists-with-different-credential":
      return "auth.firebaseError.accountExists";
    case "FIREBASE_NOT_CONFIGURED":
      return "auth.firebaseError.notConfigured";
    default:
      return "auth.firebaseError.generic";
  }
}

export function firebaseErrorDebug(error: unknown): string {
  if (typeof error === "object" && error && "code" in error) {
    const code = String((error as { code: string }).code);
    const message =
      "message" in error ? String((error as { message: string }).message) : "";
    return message ? `${code}: ${message}` : code;
  }
  if (error instanceof Error) return error.message;
  return String(error ?? "unknown");
}
