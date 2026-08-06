"use client";

import { TextButton } from "@/components/common/IconButton";
import { useTranslations } from "@/context/LocaleContext";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const { t } = useTranslations();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/my";
  const [email, setEmail] = useState("dev@padopado.local");
  const [password, setPassword] = useState("padopado-dev");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
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
    router.push(callbackUrl);
    router.refresh();
  };

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
        onSubmit={(event) => void onSubmit(event)}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm">…</div>}>
      <LoginForm />
    </Suspense>
  );
}
