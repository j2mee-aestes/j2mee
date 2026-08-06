import { auth } from "@/auth";

export class AuthError extends Error {
  status: number;
  code: string;

  constructor(code: string, status = 401, message?: string) {
    super(message ?? code);
    this.code = code;
    this.status = status;
  }
}

export async function requireUserId(): Promise<string> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new AuthError("loginRequired", 401);
  }
  return userId;
}

export async function getOptionalUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
