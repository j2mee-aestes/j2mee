import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import { z } from "zod";
import { prisma } from "@/server/db";
import { ensureDevUser } from "@/server/services/devUserService";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(4).max(128),
});

const providers: Provider[] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  providers.push(
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    }),
  );
}

providers.push(
  Credentials({
    id: "credentials",
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) {
        return null;
      }
      await ensureDevUser();
      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email.toLowerCase() },
      });
      if (!user?.passwordHash) {
        return null;
      }
      const ok = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!ok) {
        return null;
      }
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            preferredLocale: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        });
        if (dbUser) {
          token.preferredLocale = dbUser.preferredLocale;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.preferredLocale =
          typeof token.preferredLocale === "string"
            ? token.preferredLocale
            : "ko";
        session.user.role =
          typeof token.role === "string" ? token.role : "user";
      }
      return session;
    },
  },
});
