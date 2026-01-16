# Bankr API Response Schema

Complete TypeScript interfaces for the Bankr Agent API responses.

## Submit Prompt Response

```typescript
interface PromptResponse {
  success: boolean;
  jobId?: string;    // Present on success
  status?: string;   // Usually "pending"
  message?: string;  // Info message
  error?: string;    // Present on failure
}
```

## Job Status Response

```typescript
interface JobStatusResponse {
  success: boolean;
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  prompt: string;              // Original prompt submitted
  response?: string;           // Final text response (on completion)
  transactions?: Transaction[];// Executed blockchain transactions
  richData?: RichData[];       // Images, charts, visualizations
  statusUpdates?: StatusUpdate[]; // Progress messages
  error?: string;              // Error message (on failure)
  createdAt: string;           // ISO timestamp
  completedAt?: string;        // ISO timestamp (on completion)
  startedAt?: string;          // ISO timestamp (when processing began)
  cancelledAt?: string;        // ISO timestamp (if cancelled)
  processingTime?: number;     // Duration in milliseconds
}
```

## Transaction Structure

Transactions represent blockchain operations executed by Bankr:

```typescript
interface Transaction {
  type: string;      // Transaction type identifier
  metadata?: {
    // Raw transaction data (for advanced use)
    transaction?: {
      chainId: number;   // Chain ID (e.g., 8453 for Base)
      to: string;        // Contract address
      data: string;      // Encoded call data
      gas?: string;      // Gas limit
      value?: string;    // ETH value in wei
    };
    // Human-readable summary
    humanReadableMessage?: string;  // e.g., "Swapped 0.1 ETH for 150 USDC"
    // Token details for swaps/trades
    inputTokenTicker?: string;      // e.g., "ETH"
    outputTokenTicker?: string;     // e.g., "USDC"
    inputTokenAmount?: string;      // e.g., "0.1"
    outputTokenAmount?: string;     // e.g., "150"
  };
}
```

### Common Chain IDs

| Chain | ID |
|-------|-----|
| Ethereum Mainnet | 1 |
| Base | 8453 |
| Polygon | 137 |
| Arbitrum | 42161 |
| Optimism | 10 |
| Solana | - (different format) |

## Status Update Structure

Status updates provide real-time progress during job execution:

```typescript
interface StatusUpdate {
  message: string;     // Human-readable progress message
  timestamp: string;   // ISO timestamp
}
```

**Example status updates sequence:**
```json
[
  { "message": "Analyzing request...", "timestamp": "2024-01-15T10:00:01Z" },
  { "message": "Fetching current prices...", "timestamp": "2024-01-15T10:00:03Z" },
  { "message": "Preparing transaction...", "timestamp": "2024-01-15T10:00:05Z" },
  { "message": "Executing swap...", "timestamp": "2024-01-15T10:00:08Z" }
]
```

## Rich Data Structure

Rich data includes images, charts, and other media:

```typescript
interface RichData {
  type: string;       // Content type (e.g., "image/png", "chart")
  base64?: string;    // Base64-encoded content
  url?: string;       // URL to content
}
```

**Usage:**
- Check for `base64` first for inline content
- Fall back to `url` for externally hosted content
- The `type` field indicates how to render/display

## Complete Example Response

```json
{
  "success": true,
  "jobId": "job_abc123xyz",
  "status": "completed",
  "prompt": "Buy $50 of ETH on Base",
  "response": "Successfully purchased 0.0154 ETH on Base for $50 USDC.",
  "transactions": [
    {
      "type": "swap",
      "metadata": {
        "humanReadableMessage": "Swapped 50 USDC for 0.0154 ETH on Base",
        "inputTokenTicker": "USDC",
        "outputTokenTicker": "ETH",
        "inputTokenAmount": "50",
        "outputTokenAmount": "0.0154",
        "transaction": {
          "chainId": 8453,
          "to": "0x...",
          "data": "0x...",
          "gas": "150000"
        }
      }
    }
  ],
  "statusUpdates": [
    { "message": "Analyzing request...", "timestamp": "2024-01-15T10:00:01Z" },
    { "message": "Fetching best route...", "timestamp": "2024-01-15T10:00:03Z" },
    { "message": "Executing swap...", "timestamp": "2024-01-15T10:00:08Z" }
  ],
  "richData": [],
  "createdAt": "2024-01-15T10:00:00Z",
  "startedAt": "2024-01-15T10:00:01Z",
  "completedAt": "2024-01-15T10:00:12Z",
  "processingTime": 12000
}
```

## Error Response Example

```json
{
  "success": true,
  "jobId": "job_def456",
  "status": "failed",
  "prompt": "Buy $1000000 of ETH",
  "error": "Insufficient balance. Available: $500 USDC",
  "statusUpdates": [
    { "message": "Analyzing request...", "timestamp": "2024-01-15T10:00:01Z" },
    { "message": "Checking balance...", "timestamp": "2024-01-15T10:00:03Z" }
  ],
  "createdAt": "2024-01-15T10:00:00Z",
  "completedAt": "2024-01-15T10:00:05Z",
  "processingTime": 5000
}
```
