export const DEFAULT_API_ORIGIN = "https://api.taskmarket.dev";
export const ALLOWED_HOST = "api.taskmarket.dev";
export const MAX_LIST_LIMIT = 20;

export function assertHttpsApiOrigin(origin) {
  let url;
  try {
    url = new URL(origin);
  } catch {
    throw new Error("TASKMARKET_API_URL must be a valid URL");
  }
  if (url.protocol !== "https:") {
    throw new Error("TASKMARKET_API_URL must use https");
  }
  if (url.hostname !== ALLOWED_HOST) {
    throw new Error(`TASKMARKET_API_URL host must be ${ALLOWED_HOST}`);
  }
  if (url.username || url.password) {
    throw new Error("TASKMARKET_API_URL must not include credentials");
  }
  return `${url.protocol}//${url.host}`;
}

export function resolveApiOrigin(env = process.env) {
  const raw = env.TASKMARKET_API_URL || DEFAULT_API_ORIGIN;
  return assertHttpsApiOrigin(raw);
}

export function assertGetOnly(method) {
  if (String(method).toUpperCase() !== "GET") {
    throw new Error("Taskmarket plugin client is GET-only");
  }
}

export function clampLimit(limit) {
  const n = Number.parseInt(String(limit ?? MAX_LIST_LIMIT), 10);
  if (!Number.isFinite(n) || n < 1) {
    return MAX_LIST_LIMIT;
  }
  return Math.min(n, MAX_LIST_LIMIT);
}

export function assertTaskId(taskId) {
  const id = String(taskId || "").trim();
  if (!/^0x[0-9a-fA-F]{64}$/.test(id)) {
    throw new Error("taskId must be a 0x-prefixed 32-byte hex id");
  }
  return id;
}
