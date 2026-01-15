---
name: sdk-job-management
description: Manage async jobs with the Bankr SDK including submission, polling, status checking, and cancellation. Use for advanced job control and monitoring.
---

# SDK Job Management

Manage async jobs: submit, poll, check status, and cancel.

## Recommended: promptAndWait

For most cases, use `promptAndWait` - it handles everything:

```typescript
const result = await client.promptAndWait({
  prompt: "Swap 0.1 ETH to USDC",
});

if (result.status === "completed") {
  console.log(result.response);
  console.log(result.transactions);
}
```

## Manual Job Control

### Submit Job

```typescript
const response = await client.prompt({
  prompt: "What are trending tokens?",
});

console.log(response.jobId);  // "job_123abc"
console.log(response.status); // "pending"
```

### Check Status

```typescript
const status = await client.getJobStatus("job_123abc");
// {
//   status: "completed" | "pending" | "processing" | "failed" | "cancelled",
//   response: "...",
//   transactions: [...],
//   processingTime: 5000
// }
```

### Poll Until Complete

```typescript
const result = await client.pollJob({
  jobId: "job_123abc",
  interval: 2000,     // 2s default
  maxAttempts: 150,   // ~5 min default
  timeout: 300000,    // 5 min default
});
```

### Cancel Job

```typescript
const cancelled = await client.cancelJob("job_123abc");
// { status: "cancelled", cancelledAt: "..." }
```

## Job Lifecycle

```
pending → processing → completed | failed | cancelled
```

## Job Status Response

```typescript
interface JobStatusResponse {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  prompt: string;
  response?: string;       // When completed
  transactions?: any[];    // When completed with txs
  richData?: any[];        // Charts, cards
  error?: string;          // When failed
  processingTime?: number;
  cancellable?: boolean;
}
```

## Batch Jobs

```typescript
const prompts = ["Price of ETH?", "Price of BTC?", "Trending tokens?"];

// Submit all
const jobs = await Promise.all(
  prompts.map(prompt => client.prompt({ prompt }))
);

// Wait for all
const results = await Promise.all(
  jobs.map(job => client.pollJob({ jobId: job.jobId }))
);
```

## Retry Pattern

```typescript
async function withRetry(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const result = await client.promptAndWait({ prompt, timeout: 60000 });
    if (result.status === "completed") return result;
    await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
  }
  throw new Error(`Failed after ${maxRetries} attempts`);
}
```

## Timing Guidelines

| Operation | Time |
|-----------|------|
| Price queries | 2-5s |
| Balance checks | 2-5s |
| Token swaps | 5-15s |
| Complex analysis | 10-30s |

## Cost

$0.10 USDC per job, regardless of completion status.
