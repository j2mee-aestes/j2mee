type LogLevel = "info" | "warn" | "error";

function emit(level: LogLevel, scope: string, message: string, meta?: unknown) {
  if (process.env.NODE_ENV === "production" && level === "info") {
    return;
  }
  const payload = {
    level,
    scope,
    message,
    // Never log secrets / exact GPS / tokens
    meta: meta ?? undefined,
    at: new Date().toISOString(),
  };
  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }
  if (level === "warn") {
    console.warn(JSON.stringify(payload));
    return;
  }
  console.info(JSON.stringify(payload));
}

export const logger = {
  info: (scope: string, message: string, meta?: unknown) =>
    emit("info", scope, message, meta),
  warn: (scope: string, message: string, meta?: unknown) =>
    emit("warn", scope, message, meta),
  error: (scope: string, message: string, meta?: unknown) =>
    emit("error", scope, message, meta),
};
