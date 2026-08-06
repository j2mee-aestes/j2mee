"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { TextButton } from "@/components/common/IconButton";
import { apiJson } from "@/lib/auth/clientApi";
import { useTranslations } from "@/context/LocaleContext";

type ContributionKind = "bin" | "attraction" | "fishing";

type ContributionFormProps = {
  kind: ContributionKind;
  title: string;
  subtitle: string;
};

export function ContributionForm({ kind, title, subtitle }: ContributionFormProps) {
  const { t } = useTranslations();
  const { status } = useSession();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [note, setNote] = useState("");
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setError(null);
      },
      () => setError(t("map.locationUnavailable")),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    if (status !== "authenticated") {
      setError(t("contribute.needAuth"));
      return;
    }
    setSubmitting(true);
    const result = await apiJson("/api/contributions", {
      method: "POST",
      body: JSON.stringify({
        kind,
        name,
        address,
        latitude: Number(lat),
        longitude: Number(lng),
        note,
        photoName,
      }),
    });
    setSubmitting(false);
    if (!result.ok) {
      setError(t("contribute.submitFailed"));
      return;
    }
    setMessage(t("contribute.submitted"));
    setName("");
    setAddress("");
    setNote("");
    setPhotoName(null);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-xl px-4 py-10 sm:px-6">
      <Link
        href="/contribute"
        className="text-sm font-semibold text-[var(--color-accent-strong)]"
      >
        ← {t("contribute.back")}
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
      {(kind === "attraction" || kind === "fishing") && (
        <p className="mt-2 text-xs font-medium text-[var(--color-accent-strong)]">
          {t("contribute.voteThreshold", { count: 500 })}
        </p>
      )}

      <form onSubmit={onSubmit} className="glass-panel mt-6 space-y-4 rounded-2xl p-5">
        <label className="block text-sm">
          <span className="font-semibold">{t("contribute.formName")}</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 h-11 w-full rounded-full border border-[var(--color-border)] bg-white/90 px-4"
          />
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{t("contribute.formAddress")}</span>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 h-11 w-full rounded-full border border-[var(--color-border)] bg-white/90 px-4"
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="font-semibold">{t("contribute.formLat")}</span>
            <input
              required
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="mt-1 h-11 w-full rounded-full border border-[var(--color-border)] bg-white/90 px-4"
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold">{t("contribute.formLng")}</span>
            <input
              required
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="mt-1 h-11 w-full rounded-full border border-[var(--color-border)] bg-white/90 px-4"
            />
          </label>
        </div>
        <TextButton type="button" variant="secondary" onClick={useMyLocation}>
          {t("contribute.useMyLocation")}
        </TextButton>
        <label className="block text-sm">
          <span className="font-semibold">{t("contribute.formPhoto")}</span>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="mt-1 block w-full text-xs"
            onChange={(e) =>
              setPhotoName(e.target.files?.[0]?.name ?? null)
            }
          />
          {photoName ? (
            <span className="mt-1 block text-xs text-[var(--color-text-muted)]">
              {photoName}
            </span>
          ) : null}
        </label>
        <label className="block text-sm">
          <span className="font-semibold">{t("contribute.formNote")}</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-2xl border border-[var(--color-border)] bg-white/90 px-4 py-3"
          />
        </label>
        <TextButton type="submit" variant="primary" disabled={submitting} className="w-full">
          {t("contribute.submit")}
        </TextButton>
        {message ? (
          <p className="rounded-2xl bg-[var(--color-accent-soft)] px-3 py-2 text-xs text-[var(--color-accent-strong)]" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900" role="alert">
            {error}{" "}
            {status !== "authenticated" ? (
              <Link href="/login" className="font-semibold underline">
                {t("common.login")}
              </Link>
            ) : null}
          </p>
        ) : null}
        <p className="text-[11px] text-[var(--color-text-muted)]">
          {t("contribute.mileageNote")}
        </p>
      </form>
    </main>
  );
}
