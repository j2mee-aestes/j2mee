"use client";

import { TextButton } from "@/components/common/IconButton";
import { useFirebaseAuth } from "@/context/FirebaseAuthContext";
import { useTranslations } from "@/context/LocaleContext";
import { consumeAuthCallback } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

function LoginForm() {
  const { t } = useTranslations();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/my";
  const firebase = useFirebaseAuth();
  const firebaseEnabled = isFirebaseConfigured();

  const [email, setEmail] = useState(
    firebaseEnabled ? "" : "dev@padopado.local",
  );
  const [password, setPassword] = useState(
    firebaseEnabled ? "" : "padopado-dev",
  );
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [checkingRedirect, setCheckingRedirect] = useState(firebaseEnabled);

  const finish = (nextUrl?: string) => {
    router.push(nextUrl || callbackUrl);
    router.refresh();
  };

  useEffect(() => {
    if (!firebaseEnabled) {
      setCheckingRedirect(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const user = await firebase.completeRedirect();
        if (cancelled) return;
        if (user || firebase.user) {
          finish(consumeAuthCallback(callbackUrl));
          return;
        }
      } catch (err) {
        if (!cancelled) {
          setError(t(firebase.mapError(err)));
          setErrorDetail(firebase.debugError(err));
        }
      } finally {
        if (!cancelled) setCheckingRedirect(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // Only run on mount / when firebase becomes ready
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseEnabled, firebase.ready]);

  useEffect(() => {
    if (!firebaseEnabled || checkingRedirect) return;
    if (firebase.user) {
      finish(consumeAuthCallback(callbackUrl));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebase.user, checkingRedirect, firebaseEnabled]);

  const onFirebaseEmail = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError(null);
    setErrorDetail(null);
    try {
      if (mode === "register") {
        await firebase.registerEmail(email, password);
      } else {
        await firebase.signInEmail(email, password);
      }
      finish();
    } catch (err) {
      setError(t(firebase.mapError(err)));
      setErrorDetail(firebase.debugError(err));
    } finally {
      setPending(false);
    }
  };

  const onGoogle = async () => {
    setPending(true);
    setError(null);
    setErrorDetail(null);
    try {
      const result = await firebase.signInGoogle(callbackUrl);
      if (result === "redirecting") {
        // Browser navigates to Google; keep pending state.
        return;
      }
      finish();
    } catch (err) {
      setError(t(firebase.mapError(err)));
      setErrorDetail(firebase.debugError(err));
      setPending(false);
    }
  };

  const onAuthJsSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isStaticExport) {
      router.push(callbackUrl);
      return;
    }
    setPending(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setPending(false);
    if (result?.error) {
      setError(t("auth.loginFailed"));
      return;
    }
    finish();
  };

  if (firebaseEnabled) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-3 py-10">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t("auth.loginTitle")}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {t("auth.firebaseSubtitle")}
          </p>
        </div>

        {(checkingRedirect || pending) && !error ? (
          <p
            className="rounded-[var(--radius-md)] border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900"
            role="status"
          >
            {t("auth.firebaseRedirecting")}
          </p>
        ) : null}

        <button
          type="button"
          disabled={pending || checkingRedirect}
          onClick={() => void onGoogle()}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white text-sm font-semibold text-[var(--color-text-primary)] shadow-[var(--shadow-soft)] transition hover:bg-sky-50 disabled:opacity-60"
        >
          <GoogleMark />
          {t("auth.continueWithGoogle")}
        </button>

        <div className="flex items-center gap-3 text-[11px] text-[var(--color-text-muted)]">
          <span className="h-px flex-1 bg-[var(--color-border)]" />
          {t("auth.orEmail")}
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>

        <form
          onSubmit={(event) => void onFirebaseEmail(event)}
          className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
        >
          <div className="flex gap-2 text-xs font-semibold">
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 ${
                mode === "signin"
                  ? "bg-[var(--color-accent-strong)] text-white"
                  : "bg-[var(--color-foam)] text-[var(--color-text-secondary)]"
              }`}
              onClick={() => setMode("signin")}
            >
              {t("common.login")}
            </button>
            <button
              type="button"
              className={`rounded-full px-3 py-1.5 ${
                mode === "register"
                  ? "bg-[var(--color-accent-strong)] text-white"
                  : "bg-[var(--color-foam)] text-[var(--color-text-secondary)]"
              }`}
              onClick={() => setMode("register")}
            >
              {t("auth.register")}
            </button>
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium">
              {t("auth.email")}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium">
              {t("auth.password")}
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
              required
              minLength={6}
            />
          </div>
          {error ? (
            <div className="space-y-1" role="alert">
              <p className="text-xs text-red-700">{error}</p>
              {errorDetail ? (
                <p className="break-all text-[10px] text-red-500/90">
                  {errorDetail}
                </p>
              ) : null}
            </div>
          ) : null}
          <TextButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={pending || checkingRedirect}
          >
            {pending
              ? t("common.loading")
              : mode === "register"
                ? t("auth.register")
                : t("common.login")}
          </TextButton>
        </form>

        <p className="text-xs text-[var(--color-text-muted)]">
          {t("auth.firebasePrivacyNote")}
        </p>

        <Link
          href="/map"
          className="text-sm font-medium text-[var(--color-ocean-700)]"
        >
          {t("activity.backToMap")}
        </Link>
      </div>
    );
  }


  if (isStaticExport) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-3 py-10">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            {t("auth.loginTitle")}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {t("auth.staticLoginHint")}
          </p>
        </div>
        <div className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            {t("auth.firebaseSetupNeeded")}
          </p>
          <Link
            href={callbackUrl}
            className="inline-flex h-10 w-full items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-strong)] text-sm font-semibold text-white"
          >
            {t("auth.myPage")}
          </Link>
        </div>
        <Link
          href="/map"
          className="text-sm font-medium text-[var(--color-ocean-700)]"
        >
          {t("activity.backToMap")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-3 py-10">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          {t("auth.loginTitle")}
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          {t("auth.loginSubtitle")}
        </p>
      </div>

      <form
        onSubmit={(event) => void onAuthJsSubmit(event)}
        className="space-y-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4"
      >
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium">
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-medium">
            {t("auth.password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm"
            required
          />
        </div>
        {error ? (
          <p className="text-xs text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <TextButton
          type="submit"
          variant="primary"
          className="w-full"
          disabled={pending}
        >
          {pending ? t("common.loading") : t("common.login")}
        </TextButton>
      </form>

      <p className="rounded-[var(--radius-md)] border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-900">
        {t("auth.devHint")}
      </p>

      <p className="text-xs text-[var(--color-text-muted)]">
        {t("auth.privacyNote")}
      </p>

      <Link
        href="/"
        className="text-sm font-medium text-[var(--color-ocean-700)]"
      >
        {t("activity.backToMap")}
      </Link>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.8 1.2 8 3.1l5.7-5.7C34.2 6.1 29.4 4 24 4 16.1 4 9.2 8.5 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.9 26.8 37 24 37c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.1 39.5 16 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l.1.1 6.2 5.2C39.2 36.3 44 31 44 24c0-1.3-.1-2.5-.4-3.5z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm">…</div>}>
      <LoginForm />
    </Suspense>
  );
}
