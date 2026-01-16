/**
 * Basic Bankr Agent API Client
 *
 * A minimal TypeScript client for the Bankr Agent API.
 * Copy this into your project and customize as needed.
 */

const API_URL = process.env.BANKR_API_URL || "https://api.bankr.bot";
const API_KEY = process.env.BANKR_API_KEY;

// Types
interface PromptResponse {
  success: boolean;
  jobId?: string;
  status?: string;
  message?: string;
  error?: string;
}

interface JobStatusResponse {
  success: boolean;
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  prompt: string;
  response?: string;
  transactions?: Transaction[];
  richData?: RichData[];
  statusUpdates?: StatusUpdate[];
  error?: string;
  createdAt: string;
  completedAt?: string;
  processingTime?: number;
}

interface Transaction {
  type: string;
  metadata?: {
    humanReadableMessage?: string;
    inputTokenTicker?: string;
    outputTokenTicker?: string;
    inputTokenAmount?: string;
    outputTokenAmount?: string;
    transaction?: {
      chainId: number;
      to: string;
      data: string;
      gas?: string;
      value?: string;
    };
  };
}

interface StatusUpdate {
  message: string;
  timestamp: string;
}

interface RichData {
  type: string;
  base64?: string;
  url?: string;
}

// API Functions

/**
 * Submit a prompt to the Bankr Agent API
 */
export async function submitPrompt(prompt: string): Promise<PromptResponse> {
  if (!API_KEY) {
    throw new Error("BANKR_API_KEY environment variable is not set");
  }

  const response = await fetch(`${API_URL}/agent/prompt`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Get the status of a Bankr job
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  if (!API_KEY) {
    throw new Error("BANKR_API_KEY environment variable is not set");
  }

  const response = await fetch(`${API_URL}/agent/job/${jobId}`, {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Cancel a running Bankr job
 */
export async function cancelJob(jobId: string): Promise<JobStatusResponse> {
  if (!API_KEY) {
    throw new Error("BANKR_API_KEY environment variable is not set");
  }

  const response = await fetch(`${API_URL}/agent/job/${jobId}/cancel`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Wait for a job to complete, polling every 2 seconds
 */
export async function waitForCompletion(
  jobId: string,
  options?: {
    pollInterval?: number;
    maxPolls?: number;
    onStatusUpdate?: (message: string) => void;
  }
): Promise<JobStatusResponse> {
  const pollInterval = options?.pollInterval ?? 2000;
  const maxPolls = options?.maxPolls ?? 120; // 4 minutes default

  let lastUpdateCount = 0;

  for (let i = 0; i < maxPolls; i++) {
    const status = await getJobStatus(jobId);

    // Report new status updates
    if (options?.onStatusUpdate && status.statusUpdates) {
      for (let j = lastUpdateCount; j < status.statusUpdates.length; j++) {
        options.onStatusUpdate(status.statusUpdates[j].message);
      }
      lastUpdateCount = status.statusUpdates.length;
    }

    // Check for terminal states
    if (["completed", "failed", "cancelled"].includes(status.status)) {
      return status;
    }

    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(`Job ${jobId} timed out after ${maxPolls * pollInterval}ms`);
}

// Usage Example
async function main() {
  try {
    // Submit a prompt
    console.log("Submitting prompt...");
    const { jobId } = await submitPrompt("What is the price of ETH?");
    console.log(`Job submitted: ${jobId}`);

    // Wait for completion with status updates
    console.log("Waiting for completion...");
    const result = await waitForCompletion(jobId, {
      onStatusUpdate: (msg) => console.log(`  > ${msg}`),
    });

    // Handle result
    if (result.status === "completed") {
      console.log("\nResult:");
      console.log(result.response);

      if (result.transactions?.length) {
        console.log("\nTransactions:");
        for (const tx of result.transactions) {
          console.log(`  - ${tx.metadata?.humanReadableMessage || tx.type}`);
        }
      }
    } else if (result.status === "failed") {
      console.error(`\nJob failed: ${result.error}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run if executed directly
main();
