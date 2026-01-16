/**
 * Advanced Polling with Status Updates
 *
 * Demonstrates how to poll for job completion while streaming
 * status updates to the user in real-time.
 */

import { submitPrompt, getJobStatus, JobStatusResponse } from "./basic-client";

interface PollingOptions {
  pollInterval?: number; // ms between polls (default: 2000)
  maxDuration?: number; // max total duration in ms (default: 240000 = 4 min)
  onProgress?: (update: ProgressUpdate) => void;
}

interface ProgressUpdate {
  type: "status" | "message" | "complete" | "error";
  status?: string;
  message?: string;
  result?: JobStatusResponse;
}

/**
 * Poll for job completion with progress callbacks
 */
export async function pollWithProgress(
  jobId: string,
  options: PollingOptions = {}
): Promise<JobStatusResponse> {
  const pollInterval = options.pollInterval ?? 2000;
  const maxDuration = options.maxDuration ?? 240000;
  const startTime = Date.now();

  let lastStatus = "";
  let lastUpdateIndex = 0;

  while (Date.now() - startTime < maxDuration) {
    const job = await getJobStatus(jobId);

    // Report status changes
    if (job.status !== lastStatus) {
      lastStatus = job.status;
      options.onProgress?.({
        type: "status",
        status: job.status,
        message: `Job status: ${job.status}`,
      });
    }

    // Report new status updates
    if (job.statusUpdates) {
      for (let i = lastUpdateIndex; i < job.statusUpdates.length; i++) {
        options.onProgress?.({
          type: "message",
          message: job.statusUpdates[i].message,
        });
      }
      lastUpdateIndex = job.statusUpdates.length;
    }

    // Check for terminal states
    if (job.status === "completed") {
      options.onProgress?.({
        type: "complete",
        result: job,
        message: "Job completed successfully",
      });
      return job;
    }

    if (job.status === "failed") {
      options.onProgress?.({
        type: "error",
        result: job,
        message: job.error || "Job failed",
      });
      return job;
    }

    if (job.status === "cancelled") {
      options.onProgress?.({
        type: "error",
        result: job,
        message: "Job was cancelled",
      });
      return job;
    }

    await new Promise((r) => setTimeout(r, pollInterval));
  }

  throw new Error(`Job timed out after ${maxDuration}ms`);
}

/**
 * Execute a prompt and wait for result with progress updates
 */
export async function executeWithProgress(
  prompt: string,
  options: PollingOptions = {}
): Promise<JobStatusResponse> {
  const { jobId } = await submitPrompt(prompt);

  options.onProgress?.({
    type: "status",
    status: "submitted",
    message: `Job submitted: ${jobId}`,
  });

  return pollWithProgress(jobId, options);
}

// Example: CLI with live progress output
async function cliExample() {
  const prompt = process.argv[2] || "What is the price of Bitcoin?";

  console.log(`\nExecuting: "${prompt}"\n`);
  console.log("─".repeat(50));

  const result = await executeWithProgress(prompt, {
    onProgress: (update) => {
      const timestamp = new Date().toLocaleTimeString();

      switch (update.type) {
        case "status":
          console.log(`[${timestamp}] Status: ${update.status}`);
          break;
        case "message":
          console.log(`[${timestamp}] > ${update.message}`);
          break;
        case "complete":
          console.log(`[${timestamp}] ✓ Completed`);
          break;
        case "error":
          console.log(`[${timestamp}] ✗ ${update.message}`);
          break;
      }
    },
  });

  console.log("─".repeat(50));

  if (result.status === "completed" && result.response) {
    console.log("\nResponse:");
    console.log(result.response);

    if (result.transactions?.length) {
      console.log("\nTransactions:");
      for (const tx of result.transactions) {
        const msg = tx.metadata?.humanReadableMessage || tx.type;
        console.log(`  • ${msg}`);
      }
    }

    if (result.processingTime) {
      console.log(`\nProcessing time: ${result.processingTime}ms`);
    }
  } else if (result.error) {
    console.error(`\nError: ${result.error}`);
  }
}

// Run CLI example if executed directly
cliExample().catch(console.error);
