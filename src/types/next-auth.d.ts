import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      preferredLocale?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    preferredLocale?: string;
  }
}
