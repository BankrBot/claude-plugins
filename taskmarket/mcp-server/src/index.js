#!/usr/bin/env node

import { stdin, stdout } from "node:process";
import { createClient } from "./client.js";

const TOOLS = [
  {
    name: "taskmarket_list_tasks",
    description:
      "Browse open Taskmarket work (public GET). Default status=open, limit capped at 20.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Task status filter (default open)" },
        limit: { type: "number", description: "Max rows, capped at 20" },
      },
    },
  },
  {
    name: "taskmarket_get_task",
    description: "Inspect one Taskmarket task by 0x id (public GET).",
    inputSchema: {
      type: "object",
      required: ["taskId"],
      properties: {
        taskId: { type: "string", description: "0x-prefixed 32-byte task id" },
      },
    },
  },
  {
    name: "taskmarket_list_submissions",
    description: "List public submissions for a task so a human can review them (GET).",
    inputSchema: {
      type: "object",
      required: ["taskId"],
      properties: {
        taskId: { type: "string" },
      },
    },
  },
  {
    name: "taskmarket_create_preview",
    description:
      "Print a first-party CLI command to create a bounty. Does not fetch, sign, or spend. Human must run the CLI after explicit confirm.",
    inputSchema: {
      type: "object",
      required: ["description", "rewardUsdc"],
      properties: {
        description: { type: "string" },
        rewardUsdc: { type: "number" },
        durationHours: { type: "number" },
      },
    },
  },
];

function send(message) {
  const json = JSON.stringify(message);
  stdout.write(`Content-Length: ${Buffer.byteLength(json)}\r\n\r\n${json}`);
}

function textResult(payload) {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
  };
}

function errorResult(err) {
  return {
    content: [{ type: "text", text: String(err?.message || err) }],
    isError: true,
  };
}

async function callTool(name, args) {
  const client = createClient();
  switch (name) {
    case "taskmarket_list_tasks":
      return textResult(await client.listTasks(args || {}));
    case "taskmarket_get_task":
      return textResult(await client.getTask(args?.taskId));
    case "taskmarket_list_submissions":
      return textResult(await client.listSubmissions(args?.taskId));
    case "taskmarket_create_preview":
      return textResult(client.createPreview(args || {}));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function handle(message) {
  if (message.method === "initialize") {
    send({
      jsonrpc: "2.0",
      id: message.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: { name: "taskmarket", version: "1.0.0" },
      },
    });
    return;
  }
  if (message.method === "notifications/initialized") {
    return;
  }
  if (message.method === "tools/list") {
    send({ jsonrpc: "2.0", id: message.id, result: { tools: TOOLS } });
    return;
  }
  if (message.method === "tools/call") {
    try {
      const result = await callTool(message.params?.name, message.params?.arguments || {});
      send({ jsonrpc: "2.0", id: message.id, result });
    } catch (err) {
      send({ jsonrpc: "2.0", id: message.id, result: errorResult(err) });
    }
    return;
  }
  if (message.id !== undefined) {
    send({
      jsonrpc: "2.0",
      id: message.id,
      error: { code: -32601, message: `Method not found: ${message.method}` },
    });
  }
}

let buf = Buffer.alloc(0);
stdin.on("data", (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  while (true) {
    const headerEnd = buf.indexOf("\r\n\r\n");
    if (headerEnd === -1) {
      return;
    }
    const header = buf.slice(0, headerEnd).toString("utf8");
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buf = buf.slice(headerEnd + 4);
      continue;
    }
    const len = Number(match[1]);
    const bodyStart = headerEnd + 4;
    if (buf.length < bodyStart + len) {
      return;
    }
    const body = buf.slice(bodyStart, bodyStart + len).toString("utf8");
    buf = buf.slice(bodyStart + len);
    handle(JSON.parse(body)).catch((err) => {
      process.stderr.write(String(err?.stack || err) + "\n");
    });
  }
});

stdin.resume();
