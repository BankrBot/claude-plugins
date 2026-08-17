import {
  assertGetOnly,
  assertTaskId,
  clampLimit,
  resolveApiOrigin,
} from "./safety.js";

async function getJson(origin, path, { fetchImpl = fetch } = {}) {
  assertGetOnly("GET");
  const url = `${origin}${path}`;
  const response = await fetchImpl(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Taskmarket GET ${path} failed: ${response.status} ${text.slice(0, 240)}`);
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Taskmarket GET ${path} returned non-JSON`);
  }
}

export function createClient({ env = process.env, fetchImpl = fetch } = {}) {
  const origin = resolveApiOrigin(env);

  return {
    origin,
    async listTasks({ status = "open", limit = 20 } = {}) {
      const capped = clampLimit(limit);
      const params = new URLSearchParams({
        status: String(status || "open"),
        limit: String(capped),
      });
      return getJson(origin, `/api/tasks?${params}`, { fetchImpl });
    },
    async getTask(taskId) {
      const id = assertTaskId(taskId);
      return getJson(origin, `/api/tasks/${id}`, { fetchImpl });
    },
    async listSubmissions(taskId) {
      const id = assertTaskId(taskId);
      return getJson(origin, `/api/tasks/${id}/submissions`, { fetchImpl });
    },
    createPreview({ description, rewardUsdc, durationHours = 72 } = {}) {
      const desc = String(description || "").trim();
      const reward = Number(rewardUsdc);
      const hours = Number(durationHours);
      if (!desc) {
        throw new Error("description is required for create_preview");
      }
      if (!Number.isFinite(reward) || reward <= 0) {
        throw new Error("rewardUsdc must be a positive number");
      }
      if (!Number.isFinite(hours) || hours < 1) {
        throw new Error("durationHours must be >= 1");
      }
      const cmd = [
        "taskmarket task create",
        `--description ${JSON.stringify(desc)}`,
        `--reward ${reward}`,
        `--duration-hours ${Math.trunc(hours)}`,
        "--mode bounty",
      ].join(" ");
      return {
        previewOnly: true,
        fetched: false,
        instruction:
          "This plugin never creates tasks or spends USDC. Run the first-party CLI yourself after an explicit human confirm. Wallet keys stay in the CLI.",
        command: cmd,
      };
    },
  };
}
