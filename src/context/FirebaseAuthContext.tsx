"use client";

import {
  completeGoogleRedirect,
  firebaseAuthReady,
  firebaseErrorDebug,
  mapFirebaseAuthError,
  registerWithEmailPassword,
  signInWithEmailPassword,
  signInWithGoogle,
  signOutFirebase,
  subscribeFirebaseAuth,
  type FirebaseAuthUser,
} from "@/lib/firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type FirebaseAuthContextValue = {
  configured: boolean;
  ready: boolean;
  user: FirebaseAuthUser | null;
  signInGoogle: (callbackUrl?: string) => Promise<"ok" | "redirecting">;
  signInEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  mapError: (error: unknown) => string;
  debugError: (error: unknown) => string;
  completeRedirect: () => Promise<FirebaseAuthUser | null>;
};

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(
  null,
);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const configured = firebaseAuthReady();
  const [ready, setReady] = useState(!configured);
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);

  useEffect(() => {
    if (!configured) {
      setReady(true);
      setUser(null);
      return;
    }

    let active = true;
    const unsubscribe = subscribeFirebaseAuth((next) => {
      if (!active) return;
      setUser(next);
      setReady(true);
    });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [configured]);

  const mapError = useCallback((error: unknown) => {
    if (typeof error === "object" && error && "code" in error) {
      return mapFirebaseAuthError(String((error as { code: string }).code));
    }
    if (error instanceof Error) {
      return mapFirebaseAuthError(error.message);
    }
    return mapFirebaseAuthError(String(error ?? "unknown"));
  }, []);

  const debugError = useCallback((error: unknown) => firebaseErrorDebug(error), []);

  const signInGoogle = useCallback(async (callbackUrl = "/my") => {
    const result = await signInWithGoogle(callbackUrl);
    return result === "redirecting" ? "redirecting" : "ok";
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailPassword(email, password);
  }, []);

  const registerEmail = useCallback(async (email: string, password: string) => {
    await registerWithEmailPassword(email, password);
  }, []);

  const signOut = useCallback(async () => {
    await signOutFirebase();
  }, []);

  const completeRedirect = useCallback(async () => completeGoogleRedirect(), []);

  const value = useMemo(
    () => ({
      configured,
      ready,
      user,
      signInGoogle,
      signInEmail,
      registerEmail,
      signOut,
      mapError,
      debugError,
      completeRedirect,
    }),
    [
      configured,
      ready,
      user,
      signInGoogle,
      signInEmail,
      registerEmail,
      signOut,
      mapError,
      debugError,
      completeRedirect,
    ],
  );

  return (
    <FirebaseAuthContext.Provider value={value}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}

export function useFirebaseAuth(): FirebaseAuthContextValue {
  const ctx = useContext(FirebaseAuthContext);
  if (!ctx) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  }
  return ctx;
}
