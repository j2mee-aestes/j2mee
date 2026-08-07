"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

export function SessionProvider({ children }: { children: ReactNode }) {
  // GitHub Pages has no /api/auth — skip session fetch so guest pages load.
  if (isStaticExport) {
    return (
      <NextAuthSessionProvider
        session={null}
        refetchInterval={0}
        refetchOnWindowFocus={false}
      >
        {children}
      </NextAuthSessionProvider>
    );
  }
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
