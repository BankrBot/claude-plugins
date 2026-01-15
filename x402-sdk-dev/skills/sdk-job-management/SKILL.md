---
name: SDK Job Management
description: This skill should be used when the user asks about "job status", "check if request completed", "cancel request", "why is my request taking so long", "poll for result", "batch requests", "retry failed request", "request timeout", "async operations", "job lifecycle", "manual polling", or needs advanced control over SDK async operations, manual job polling, batch processing, retry logic, or job cancellation.
version: 1.0.0
---

# SDK Job Management

Manage asynchronous jobs in the Bankr SDK: submit, poll, check status, cancel, and handle batch operations.

## Overview

The Bankr SDK processes requests asynchronously through a job-based system. Each request creates a job that progresses through a lifecycle from submission to completion. Understanding job management enables advanced control over SDK operations including manual polling, batch processing, and retry strategies.

**Key capabilities:**
- Submit jobs and receive job IDs
- Poll for job completion
- Check job status at any time
- Cancel pending or processing jobs
- Batch multiple requests efficiently
- Implement retry logic for failed jobs

## Recommended: promptAndWait

For most use cases, use `promptAndWait` which handles job submission and polling automatically:

```typescript
import { BankrClient } from "@bankr/sdk";

const client = new BankrClient({
  privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
  walletAddress: process.env.BANKR_WALLET_ADDRESS,
});

const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC",
  timeout: 60000, // Optional: custom timeout (default 5 min)
});

if (result.status === "completed") {
  console.log(result.response);
  console.log(result.transactions);
}
```

The `promptAndWait` method:
1. Submits the job to the API
2. Polls for completion at regular intervals
3. Returns when job completes, fails, or times out

## Manual Job Control

For advanced use cases, use manual job control methods to manage the job lifecycle directly.

### Submit Job

Submit a job and receive a job ID without waiting for completion:

```typescript
const response = await client.prompt({
  prompt: "What are trending tokens?",
});

console.log(response.jobId);  // "job_abc123def456"
console.log(response.status); // "pending"
```

The `prompt` method returns immediately with job metadata, allowing the application to continue other work while the job processes.

### Check Job Status

Query the current status of a job at any time:

```typescript
const status = await client.getJobStatus("job_abc123def456");

console.log(status);
// {
//   jobId: "job_abc123def456",
//   status: "completed",
//   prompt: "What are trending tokens?",
//   response: "The trending tokens on Base are...",
//   transactions: [],
//   richData: [...],
//   processingTime: 5230
// }
```

### Poll Until Complete

Poll a job until it reaches a terminal state (completed, failed, or cancelled):

```typescript
const result = await client.pollJob({
  jobId: "job_abc123def456",
  interval: 2000,     // Poll every 2 seconds (default)
  maxAttempts: 150,   // Maximum poll attempts (default: ~5 min at 2s)
  timeout: 300000,    // Overall timeout in ms (default: 5 min)
});

if (result.status === "completed") {
  console.log(result.response);
} else if (result.status === "failed") {
  console.error(result.error);
}
```

### Cancel Job

Cancel a pending or processing job:

```typescript
const cancelResult = await client.cancelJob("job_abc123def456");

console.log(cancelResult);
// {
//   status: "cancelled",
//   cancelledAt: "2024-01-15T10:30:00.000Z",
//   jobId: "job_abc123def456"
// }
```

**Important**: Only jobs in `pending` or `processing` states can be cancelled. Completed or failed jobs cannot be cancelled.

## Job Lifecycle

Jobs progress through the following states:

```
pending → processing → completed
                    ↘ failed
                    ↘ cancelled
```

| State | Description | Cancellable |
|-------|-------------|-------------|
| pending | Job submitted, awaiting processing | Yes |
| processing | Job actively being processed | Yes |
| completed | Job finished successfully | No |
| failed | Job encountered an error | No |
| cancelled | Job was cancelled by user | No |

## Job Status Response

The complete job status response interface:

```typescript
interface JobStatusResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  prompt: string;              // Original prompt
  response?: string;           // AI response (when completed)
  transactions?: Transaction[]; // Transaction data (when applicable)
  richData?: RichDataItem[];   // Charts, cards, tables
  error?: string;              // Error message (when failed)
  processingTime?: number;     // Time in milliseconds
  cancellable?: boolean;       // Whether job can be cancelled
  createdAt?: string;          // ISO timestamp
  completedAt?: string;        // ISO timestamp (when terminal)
}

interface Transaction {
  type: string;
  metadata: {
    __ORIGINAL_TX_DATA__: object;
    transaction: object;
    allowanceTarget?: string;
  };
}

interface RichDataItem {
  type: "chart" | "social-card" | "table" | "image";
  url?: string;
  text?: string;
  rows?: any[];
}
```

## Batch Job Processing

Submit multiple jobs in parallel for efficient batch processing:

```typescript
const prompts = [
  "What is the price of ETH?",
  "What is the price of BTC?",
  "What are trending tokens on Base?",
];

// Submit all jobs in parallel
const jobs = await Promise.all(
  prompts.map(prompt => client.prompt({ prompt }))
);

console.log(`Submitted ${jobs.length} jobs`);
// ["job_abc123", "job_def456", "job_ghi789"]

// Wait for all jobs to complete
const results = await Promise.all(
  jobs.map(job => client.pollJob({ jobId: job.jobId }))
);

// Process results
results.forEach((result, index) => {
  console.log(`Query: ${prompts[index]}`);
  console.log(`Result: ${result.response}`);
});
```

### Batch with Concurrency Limit

For large batches, limit concurrent jobs to avoid rate limiting:

```typescript
async function batchWithLimit(prompts: string[], concurrency: number = 5) {
  const results: any[] = [];

  for (let i = 0; i < prompts.length; i += concurrency) {
    const batch = prompts.slice(i, i + concurrency);

    // Submit batch
    const jobs = await Promise.all(
      batch.map(prompt => client.prompt({ prompt }))
    );

    // Wait for batch
    const batchResults = await Promise.all(
      jobs.map(job => client.pollJob({ jobId: job.jobId }))
    );

    results.push(...batchResults);

    // Optional: delay between batches
    if (i + concurrency < prompts.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return results;
}

const results = await batchWithLimit(hundredPrompts, 10);
```

## Retry Pattern

Implement retry logic for failed jobs with exponential backoff:

```typescript
async function withRetry(
  prompt: string,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<JobStatusResponse> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await client.promptAndWait({
        prompt,
        timeout: 60000,
      });

      if (result.status === "completed") {
        return result;
      }

      // Job failed, prepare for retry
      console.log(`Attempt ${attempt + 1} failed: ${result.error}`);

    } catch (error) {
      console.log(`Attempt ${attempt + 1} threw error: ${error}`);
    }

    // Exponential backoff before retry
    if (attempt < maxRetries - 1) {
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(r => setTimeout(r, delay));
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts`);
}

// Usage
try {
  const result = await withRetry("Swap 0.1 ETH to USDC");
  console.log(result.response);
} catch (error) {
  console.error("All retries exhausted:", error);
}
```

## Timeout Handling

Handle timeouts gracefully in long-running operations:

```typescript
async function withTimeout(
  prompt: string,
  timeoutMs: number = 60000
): Promise<JobStatusResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const { jobId } = await client.prompt({ prompt });

    // Poll with abort signal
    const result = await client.pollJob({
      jobId,
      timeout: timeoutMs,
    });

    clearTimeout(timeoutId);
    return result;

  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw error;
  }
}
```

## Timing Guidelines

Expected processing times by operation type:

| Operation | Typical Time | Timeout Recommendation |
|-----------|--------------|------------------------|
| Price queries | 2-5s | 15s |
| Balance checks | 2-5s | 15s |
| Token swaps | 5-15s | 60s |
| Cross-chain bridges | 10-30s | 120s |
| Complex analysis | 10-30s | 60s |
| NFT operations | 5-15s | 60s |

Adjust polling intervals and timeouts based on operation type:

```typescript
// Fast query - short timeout, fast polling
const price = await client.promptAndWait({
  prompt: "Price of ETH",
  timeout: 15000,
});

// Swap operation - longer timeout
const swap = await client.promptAndWait({
  prompt: "Swap 1 ETH to USDC",
  timeout: 60000,
});

// Manual polling with custom interval for slow operations
const bridge = await client.pollJob({
  jobId: bridgeJobId,
  interval: 5000,    // Slower polling for slow operations
  timeout: 120000,   // 2 minute timeout for bridges
});
```

## Error Handling

Handle job-related errors appropriately:

```typescript
try {
  const result = await client.promptAndWait({
    prompt: "Swap 0.1 ETH to USDC",
  });

  switch (result.status) {
    case "completed":
      console.log("Success:", result.response);
      break;

    case "failed":
      console.error("Job failed:", result.error);
      // Optionally retry
      break;

    case "cancelled":
      console.log("Job was cancelled");
      break;
  }

} catch (error) {
  if (error.message.includes("timeout")) {
    console.error("Request timed out");
  } else if (error.message.includes("rate limit")) {
    console.error("Rate limited, try again later");
  } else {
    console.error("Unexpected error:", error);
  }
}
```

## Cost

Each job costs $0.10 USDC via x402 micropayments, charged at job submission time regardless of final status. Cancelled and failed jobs still incur the charge.

## Best Practices

1. **Use promptAndWait for simple cases**: Manual job control is only needed for advanced scenarios
2. **Set appropriate timeouts**: Match timeout to expected operation duration
3. **Implement retry logic**: Some failures are transient and succeed on retry
4. **Batch efficiently**: Group related queries but respect rate limits
5. **Handle all terminal states**: Check for completed, failed, and cancelled
6. **Clean up cancelled jobs**: Do not continue polling cancelled jobs
7. **Log job IDs**: Store job IDs for debugging and support requests
