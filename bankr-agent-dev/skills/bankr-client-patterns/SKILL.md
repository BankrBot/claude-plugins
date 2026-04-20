---
name: bankr-client-patterns
description: "Use when building a Bankr API client in TypeScript, setting up project scaffolding (package.json, tsconfig.json, .env), or implementing reusable patterns for job submission, status polling, cancellation, and error handling with the Bankr REST API at api.bankr.bot."
---

# Bankr Client Patterns

Reusable TypeScript client code and project scaffolding for Bankr API integrations.

## Workflow

1. Create project files (package.json, tsconfig.json, .env) from templates below
2. Add `bankr-client.ts` as the core API module
3. Use `execute()` for simple prompt-and-wait, or `submitPrompt()` + `waitForCompletion()` for manual control
4. Handle terminal job states: `completed`, `failed`, `cancelled`

## bankr-client.ts — Core Types

```typescript
import "dotenv/config";

const API_URL = process.env.BANKR_API_URL || "https://api.bankr.bot";
const API_KEY = process.env.BANKR_API_KEY;

export type JobStatus = "pending" | "processing" | "completed" | "failed" | "cancelled";

export interface JobStatusResponse {
  success: boolean;
  jobId: string;
  status: JobStatus;
  prompt: string;
  response?: string;
  transactions?: Transaction[];
  richData?: RichData[];
  statusUpdates?: { message: string; timestamp: string }[];
  error?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  processingTime?: number;
  cancellable?: boolean;
}

// Transaction union — each variant has a `type` discriminator and `metadata`
export type Transaction =
  | { type: "swap"; metadata: BaseTransactionMetadata & { approvalRequired?: boolean; approvalTx?: { to: string; data: string }; permit2?: object } }
  | { type: "approval" | "transfer_erc20" | "transfer_eth" | "convert_eth_to_weth" | "convert_weth_to_eth" | "transfer_nft" | "mint_manifold_nft" | "mint_seadrop_nft" | "buy_nft"; metadata: BaseTransactionMetadata }
  | { type: "avantisTrade" | "swapCrossChain" | "manage_bankr_staking"; metadata: { chainId: number; description: string; to: string; data: string; value?: string } };

interface BaseTransactionMetadata {
  __ORIGINAL_TX_DATA__: {
    chain: string; humanReadableMessage: string;
    inputTokenAddress: string; inputTokenAmount: string; inputTokenTicker: string;
    outputTokenAddress: string; outputTokenTicker: string; receiver: string;
  };
  transaction: { chainId: number; to: string; data: string; gas: string; gasPrice: string; value: string };
}

export type RichData = { type: "social-card"; variant: "analysis"; text: string } | { type: "chart"; url: string };
```

## bankr-client.ts — API Functions

```typescript
export async function submitPrompt(prompt: string): Promise<{ jobId: string }> {
  if (!API_KEY) throw new Error("BANKR_API_KEY not set. Get one at https://bankr.bot/api");
  const res = await fetch(`${API_URL}/agent/prompt`, {
    method: "POST",
    headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to submit prompt");
  return { jobId: data.jobId };
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  if (!API_KEY) throw new Error("BANKR_API_KEY not set");
  const res = await fetch(`${API_URL}/agent/job/${jobId}`, { headers: { "x-api-key": API_KEY } });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function cancelJob(jobId: string): Promise<JobStatusResponse> {
  if (!API_KEY) throw new Error("BANKR_API_KEY not set");
  const res = await fetch(`${API_URL}/agent/job/${jobId}/cancel`, {
    method: "POST", headers: { "x-api-key": API_KEY, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function waitForCompletion(
  jobId: string, onProgress?: (msg: string) => void,
  opts?: { pollInterval?: number; maxAttempts?: number }
): Promise<JobStatusResponse> {
  const interval = opts?.pollInterval || 2000;
  const max = opts?.maxAttempts || 150;
  let seen = 0;
  for (let i = 0; i < max; i++) {
    const s = await getJobStatus(jobId);
    if (onProgress && s.statusUpdates)
      for (let j = seen; j < s.statusUpdates.length; j++) onProgress(s.statusUpdates[j].message);
    seen = s.statusUpdates?.length || 0;
    if (["completed", "failed", "cancelled"].includes(s.status)) return s;
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error("Job timed out");
}

/** Submit prompt and wait — convenience wrapper */
export async function execute(prompt: string, onProgress?: (msg: string) => void): Promise<JobStatusResponse> {
  const { jobId } = await submitPrompt(prompt);
  onProgress?.(`Job submitted: ${jobId}`);
  return waitForCompletion(jobId, onProgress);
}
```

## Project Scaffolding

### package.json

```json
{
  "name": "{project-name}",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": { "build": "tsc", "start": "node dist/index.js", "dev": "tsx src/index.ts" },
  "dependencies": { "dotenv": "^16.3.1" },
  "devDependencies": { "@types/node": "^20.10.0", "tsx": "^4.7.0", "typescript": "^5.3.0" }
}
```

Add framework deps as needed: `express@^4.18` + `@types/express`, `fastify@^4.25`, or `commander@^12.0`.

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022", "module": "NodeNext", "moduleResolution": "NodeNext",
    "outDir": "./dist", "rootDir": "./src", "strict": true,
    "esModuleInterop": true, "skipLibCheck": true, "declaration": true
  },
  "include": ["src/**/*"], "exclude": ["node_modules", "dist"]
}
```

### .env.example

```bash
BANKR_API_KEY=bk_your_api_key_here
BANKR_API_URL=https://api.bankr.bot
BANKR_WALLET_ADDRESS=0x...
```

## Usage Examples

```typescript
// Basic — prompt and wait
import { execute } from "./bankr-client";
const result = await execute("What is the price of ETH?", console.log);
console.log(result.response);

// With error handling
try {
  const result = await execute("Buy $50 of ETH on Base");
  if (result.status === "completed") {
    console.log(result.response);
    result.transactions?.forEach(tx =>
      console.log(`${tx.type}: ${tx.metadata.__ORIGINAL_TX_DATA__?.humanReadableMessage}`)
    );
  } else console.error("Failed:", result.error);
} catch (e) { console.error(e.message); }

// Manual control — submit, poll, cancel
import { submitPrompt, waitForCompletion, cancelJob } from "./bankr-client";
const { jobId } = await submitPrompt("Analyze ETH market");
const timeout = setTimeout(() => cancelJob(jobId), 120000);
const result = await waitForCompletion(jobId, console.log, { pollInterval: 2000, maxAttempts: 60 });
clearTimeout(timeout);
```

## Related Skills

Consult `bankr-api-basics` for complete endpoint documentation, authentication details, and error codes.
