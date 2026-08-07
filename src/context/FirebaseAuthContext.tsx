"use client";

import {
  firebaseAuthReady,
  mapFirebaseAuthError,
  registerWithEmailPassword,
  signInWithEmailPassword,
  signInWithGooglePopup,
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
  signInGoogle: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  registerEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  mapError: (error: unknown) => string;
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
    const unsubscribe = subscribeFirebaseAuth((next) => {
      setUser(next);
      setReady(true);
    });
    return () => {
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

  const signInGoogle = useCallback(async () => {
    await signInWithGooglePopup();
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
