import { NextResponse } from "next/server";
import { AuthError } from "@/server/auth/requireUser";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(code: string, status: number, detail?: string) {
  return NextResponse.json(
    { error: code, ...(detail ? { detail } : {}) },
    { status },
  );
}

export function handleRouteError(error: unknown) {
  if (error instanceof AuthError) {
    return jsonError(error.code, error.status);
  }
  if (error instanceof ZodError) {
    return jsonError("invalidPayload", 400);
  }
  if (error instanceof Error && error.message === "forbidden") {
    return jsonError("forbidden", 403);
  }
  console.error("[api]", error instanceof Error ? error.message : "unknown");
  return jsonError("serverError", 500);
}
