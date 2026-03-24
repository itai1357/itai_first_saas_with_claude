import { AsyncLocalStorage } from "async_hooks";

interface RequestContext {
  requestId: string;
}

const asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

export function initRequestContext(requestId: string): void {
  asyncLocalStorage.enterWith({ requestId });
}

function getRequestId(): string {
  return asyncLocalStorage.getStore()?.requestId ?? "unknown";
}

interface LogEntry {
  requestId: string;
  level: "info" | "error";
  message: string;
  context?: Record<string, unknown>;
}

function log(level: "info" | "error", message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    requestId: getRequestId(),
    level,
    message,
  };
  if (context) {
    entry.context = context;
  }
  console.log(JSON.stringify(entry));
}

export function getLogger() {
  return {
    info: (message: string, context?: Record<string, unknown>) => log("info", message, context),
    error: (message: string, context?: Record<string, unknown>) => log("error", message, context),
  };
}
