"use client";

import { publicPath } from "@/lib/paths";

function resolveSrc(src: string): string {
  return src.startsWith("/") ? publicPath(src) : src;
}

type PlaceImageGalleryProps = {
  images?: string[];
  alt: string;
  pendingLabel: string;
};

export function PlaceImageGallery({
  images,
  alt,
  pendingLabel,
}: PlaceImageGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <div
        className="relative flex h-36 items-end overflow-hidden rounded-2xl border border-[var(--color-border)]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #bae6fd 0%, #7dd3fc 35%, #99f6e4 70%, #bbf7d0 100%)",
        }}
        aria-hidden
      >
        <span className="m-2 rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-medium text-[var(--color-text-secondary)]">
          {pendingLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      <div className="relative h-40 overflow-hidden rounded-2xl border border-[var(--color-border)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolveSrc(images[0])}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-3 gap-2">
          {images.slice(1, 4).map((src) => (
            <div
              key={src}
              className="relative h-16 overflow-hidden rounded-xl border border-[var(--color-border)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveSrc(src)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
