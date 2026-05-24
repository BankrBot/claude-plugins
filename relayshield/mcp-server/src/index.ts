import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

const RAPIDAPI_HOST = "relayshield-security-intelligence.p.rapidapi.com";
const DEFAULT_API_URL = `https://${RAPIDAPI_HOST}`;

const apiUrl = (process.env.RELAYSHIELD_API_URL ?? DEFAULT_API_URL).replace(/\/$/, "");
const apiKey = process.env.RELAYSHIELD_API_KEY ?? "";

function rapidApiHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "x-rapidapi-key": apiKey,
    "x-rapidapi-host": RAPIDAPI_HOST,
  };
}

async function callApi(path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: rapidApiHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`RelayShield API error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function pollResult(analysisId: string, maxAttempts = 8, delayMs = 2000): Promise<unknown> {
  const headers = rapidApiHeaders();
  for (let i = 0; i < maxAttempts; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, delayMs));
    const res = await fetch(`${apiUrl}/v1/result/${analysisId}`, { headers });
    if (!res.ok) throw new Error(`Poll error ${res.status}`);
    const data = (await res.json()) as Record<string, unknown>;
    const status = (data as Record<string, Record<string, unknown>>)?.data?.status as string | undefined;
    if (status !== "pending") return data;
  }
  throw new Error("URL scan timed out — try again shortly");
}

const server = new Server(
  { name: "relayshield", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "relayshield_check_wallet",
      description:
        "Score a crypto wallet address for risk before executing a transaction. " +
        "Flags sanctions exposure, darknet market activity, mixer usage, and other on-chain red flags. " +
        "Call this before sending funds to or accepting funds from any wallet.",
      inputSchema: {
        type: "object",
        properties: {
          address: {
            type: "string",
            description: "Crypto wallet address to check (EVM, Solana, or Bitcoin)",
          },
        },
        required: ["address"],
      },
    },
    {
      name: "relayshield_check_breach",
      description:
        "Check whether an email address appears in known data breach databases. " +
        "Returns breach count, breach names, dates, and exposed data types. " +
        "Use to assess identity risk for a counterparty or your own accounts.",
      inputSchema: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email address to check for breaches",
          },
        },
        required: ["email"],
      },
    },
    {
      name: "relayshield_check_infostealer",
      description:
        "Detect whether an email address appears in infostealer malware logs — credential-harvesting trojans " +
        "(RedLine, Raccoon, Vidar) that silently steal browser-saved passwords, active session cookies " +
        "(bypassing 2FA), and crypto wallet keys. Returns infection date, OS, and credential counts. " +
        "Unlike breach monitoring, infostealer logs are near real-time (ingested within days of dark web appearance).",
      inputSchema: {
        type: "object",
        properties: {
          email: {
            type: "string",
            description: "Email address to check for infostealer malware compromise",
          },
        },
        required: ["email"],
      },
    },
    {
      name: "relayshield_scan_url",
      description:
        "Scan a URL for malware and phishing. Use before navigating to DeFi protocol links, " +
        "airdrop claim pages, NFT mint sites, or any URL shared in a trading or investment context. " +
        "Returns malicious/clean verdict.",
      inputSchema: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL to scan for malware or phishing",
          },
        },
        required: ["url"],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!apiKey) {
    return {
      content: [
        {
          type: "text",
          text: "RELAYSHIELD_API_KEY is not set. Get a free API key at https://rapidapi.com/relayshield/relayshield-security-intelligence",
        },
      ],
      isError: true,
    };
  }

  try {
    let result: unknown;

    if (name === "relayshield_check_wallet") {
      const { address } = args as { address: string };
      result = await callApi("/v1/wallet", { address });
    } else if (name === "relayshield_check_breach") {
      const { email } = args as { email: string };
      result = await callApi("/v1/breach", { email });
    } else if (name === "relayshield_check_infostealer") {
      const { email } = args as { email: string };
      result = await callApi("/v1/infostealer", { email });
    } else if (name === "relayshield_scan_url") {
      const { url } = args as { url: string };
      const response = await callApi("/v1/scan/url", { url }) as Record<string, unknown>;
      const data = response?.data as Record<string, unknown> | undefined;
      if (data?.analysis_id) {
        result = await pollResult(data.analysis_id as string);
      } else {
        result = response;
      }
    } else {
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
