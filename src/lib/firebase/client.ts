/**
 * Firebase Web client bootstrap.
 * Keys: NEXT_PUBLIC_FIREBASE_* (see docs/REQUIRED_KEYS.md / docs/auth-setup.md).
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

export type FirebaseClientConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
};

export function getFirebaseClientConfig(): FirebaseClientConfig | null {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim();
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim();
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim();

  if (!apiKey || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId,
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseClientConfig() !== null;
}

let appSingleton: FirebaseApp | null = null;
let authSingleton: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  const config = getFirebaseClientConfig();
  if (!config) return null;
  if (typeof window === "undefined") return null;

  if (!appSingleton) {
    appSingleton = getApps().length > 0 ? getApp() : initializeApp(config);
  }
  return appSingleton;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (!authSingleton) {
    authSingleton = getAuth(app);
  }
  return authSingleton;
}
