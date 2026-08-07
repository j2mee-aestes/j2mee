import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
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

export function toFirebaseAuthUser(user: User): FirebaseAuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    providerId: user.providerData[0]?.providerId ?? "firebase",
  };
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

export async function signInWithGooglePopup(): Promise<FirebaseAuthUser> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("FIREBASE_NOT_CONFIGURED");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const result = await signInWithPopup(auth, provider);
  return toFirebaseAuthUser(result.user);
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<FirebaseAuthUser> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("FIREBASE_NOT_CONFIGURED");
  const result = await signInWithEmailAndPassword(auth, email, password);
  return toFirebaseAuthUser(result.user);
}

export async function registerWithEmailPassword(
  email: string,
  password: string,
): Promise<FirebaseAuthUser> {
  const auth = getFirebaseAuth();
  if (!auth) throw new Error("FIREBASE_NOT_CONFIGURED");
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
  const code = codeOrMessage.replace(/^Firebase:\s*/i, "").split("(")[0]?.trim()
    || codeOrMessage;
  const normalized = codeOrMessage.includes("/")
    ? (codeOrMessage.match(/auth\/[a-z0-9-]+/i)?.[0] ?? code)
    : code;
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
      return "auth.firebaseError.popupBlocked";
    case "auth/network-request-failed":
      return "auth.firebaseError.network";
    case "FIREBASE_NOT_CONFIGURED":
      return "auth.firebaseError.notConfigured";
    default:
      return "auth.firebaseError.generic";
  }
}
