import assert from "node:assert/strict";
import test from "node:test";
import { createClient } from "./client.js";
import { assertHttpsApiOrigin, assertGetOnly } from "./safety.js";

function mockFetch(handler) {
  return async (url, init = {}) => {
    assert.equal(init.method, "GET");
    return handler(String(url), init);
  };
}

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() {
      return JSON.stringify(body);
    },
  };
}

test("listTasks uses public GET /api/tasks and caps limit", async () => {
  const seen = [];
  const client = createClient({
    fetchImpl: mockFetch((url) => {
      seen.push(url);
      return jsonResponse({ tasks: [{ id: "0x" + "ab".repeat(32) }] });
    }),
  });
  const out = await client.listTasks({ status: "open", limit: 99 });
  assert.equal(out.tasks.length, 1);
  assert.match(seen[0], /^https:\/\/api\.taskmarket\.dev\/api\/tasks\?/);
  assert.match(seen[0], /limit=20/);
});

test("getTask and listSubmissions hit allowlisted GET paths", async () => {
  const id = "0x" + "cd".repeat(32);
  const seen = [];
  const client = createClient({
    fetchImpl: mockFetch((url) => {
      seen.push(url);
      return jsonResponse({ ok: true, url });
    }),
  });
  await client.getTask(id);
  await client.listSubmissions(id);
  assert.deepEqual(seen, [
    `https://api.taskmarket.dev/api/tasks/${id}`,
    `https://api.taskmarket.dev/api/tasks/${id}/submissions`,
  ]);
});

test("createPreview never fetches", () => {
  let fetches = 0;
  const client = createClient({
    fetchImpl: async () => {
      fetches += 1;
      throw new Error("should not fetch");
    },
  });
  const preview = client.createPreview({
    description: "Audit one GitHub Actions pipeline",
    rewardUsdc: 50,
    durationHours: 48,
  });
  assert.equal(preview.previewOnly, true);
  assert.equal(preview.fetched, false);
  assert.equal(fetches, 0);
  assert.match(preview.command, /taskmarket task create/);
  assert.doesNotMatch(preview.command, /PRIVATE|0x[0-9a-fA-F]{64}/);
});

test("rejects http and foreign hosts", () => {
  assert.throws(() => assertHttpsApiOrigin("http://api.taskmarket.dev"), /https/);
  assert.throws(() => assertHttpsApiOrigin("https://evil.example"), /host/);
  assert.throws(() => assertGetOnly("POST"), /GET-only/);
  assert.throws(
    () =>
      createClient({
        env: { TASKMARKET_API_URL: "https://example.com" },
      }),
    /host/,
  );
});
