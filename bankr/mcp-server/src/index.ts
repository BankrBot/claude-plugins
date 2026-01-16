#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Configuration
const API_KEY = process.env.BANKR_API_KEY;
const API_URL = process.env.BANKR_API_URL || "https://api.bankr.bot";

// Types
interface PromptResponse {
  success: boolean;
  jobId?: string;
  status?: string;
  message?: string;
  error?: string;
}

interface StatusUpdate {
  message: string;
  timestamp: string;
}

interface Transaction {
  type: string;
  metadata?: {
    transaction?: {
      chainId: number;
      to: string;
      data: string;
      gas?: string;
      value?: string;
    };
    humanReadableMessage?: string;
    inputTokenTicker?: string;
    outputTokenTicker?: string;
    inputTokenAmount?: string;
    outputTokenAmount?: string;
  };
}

interface RichData {
  type: string;
  base64?: string;
  url?: string;
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
  startedAt?: string;
  cancelledAt?: string;
}

// API Client Functions
async function submitPrompt(prompt: string): Promise<PromptResponse> {
  if (!API_KEY) {
    throw new Error("BANKR_API_KEY environment variable is not set");
  }

  const response = await fetch(`${API_URL}/wallet/prompt`, {
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

async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  if (!API_KEY) {
    throw new Error("BANKR_API_KEY environment variable is not set");
  }

  const response = await fetch(`${API_URL}/wallet/job/${jobId}`, {
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

async function cancelJob(jobId: string): Promise<JobStatusResponse> {
  if (!API_KEY) {
    throw new Error("BANKR_API_KEY environment variable is not set");
  }

  const response = await fetch(`${API_URL}/wallet/job/${jobId}/cancel`, {
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

// Format job status for display
function formatJobStatus(status: JobStatusResponse): string {
  const lines: string[] = [];

  lines.push(`Job ID: ${status.jobId}`);
  lines.push(`Status: ${status.status}`);
  lines.push(`Prompt: ${status.prompt}`);

  if (status.statusUpdates && status.statusUpdates.length > 0) {
    lines.push("\nStatus Updates:");
    for (const update of status.statusUpdates) {
      lines.push(`  - ${update.message}`);
    }
  }

  if (status.response) {
    lines.push(`\nResponse:\n${status.response}`);
  }

  if (status.transactions && status.transactions.length > 0) {
    lines.push("\nTransactions:");
    for (const tx of status.transactions) {
      if (tx.metadata?.humanReadableMessage) {
        lines.push(`  - ${tx.metadata.humanReadableMessage}`);
      } else {
        lines.push(`  - ${tx.type}`);
      }
    }
  }

  if (status.error) {
    lines.push(`\nError: ${status.error}`);
  }

  if (status.processingTime) {
    lines.push(`\nProcessing time: ${status.processingTime}ms`);
  }

  return lines.join("\n");
}

// Create MCP Server
const server = new Server(
  {
    name: "bankr-api",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "bankr_submit_prompt",
        description:
          "Submit a prompt to the Bankr API for crypto trading, market analysis, or Polymarket predictions. Returns a job ID that can be used to check status.",
        inputSchema: {
          type: "object",
          properties: {
            prompt: {
              type: "string",
              description:
                "The prompt to send to Bankr (e.g., 'Buy $50 of ETH on Base', 'What is the price of Bitcoin?', 'Bet $5 on the Eagles to win')",
            },
          },
          required: ["prompt"],
        },
      },
      {
        name: "bankr_get_job_status",
        description:
          "Get the status of a Bankr job. Use this to poll for results after submitting a prompt. Status can be: pending, processing, completed, failed, or cancelled.",
        inputSchema: {
          type: "object",
          properties: {
            job_id: {
              type: "string",
              description: "The job ID returned from bankr_submit_prompt",
            },
          },
          required: ["job_id"],
        },
      },
      {
        name: "bankr_cancel_job",
        description:
          "Cancel a running Bankr job. Use this if the user wants to stop a job that is still processing.",
        inputSchema: {
          type: "object",
          properties: {
            job_id: {
              type: "string",
              description: "The job ID to cancel",
            },
          },
          required: ["job_id"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "bankr_submit_prompt": {
        const prompt = args?.prompt as string;
        if (!prompt) {
          throw new Error("prompt is required");
        }

        const result = await submitPrompt(prompt);

        if (!result.success) {
          return {
            content: [
              {
                type: "text",
                text: `Failed to submit prompt: ${result.error || result.message || "Unknown error"}`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `Prompt submitted successfully.\n\nJob ID: ${result.jobId}\nStatus: ${result.status || "pending"}\n\nUse bankr_get_job_status with this job ID to check for results. Poll every 1-2 seconds until status is "completed", "failed", or "cancelled".`,
            },
          ],
        };
      }

      case "bankr_get_job_status": {
        const jobId = args?.job_id as string;
        if (!jobId) {
          throw new Error("job_id is required");
        }

        const status = await getJobStatus(jobId);

        return {
          content: [
            {
              type: "text",
              text: formatJobStatus(status),
            },
          ],
        };
      }

      case "bankr_cancel_job": {
        const jobId = args?.job_id as string;
        if (!jobId) {
          throw new Error("job_id is required");
        }

        const result = await cancelJob(jobId);

        return {
          content: [
            {
              type: "text",
              text: `Job cancelled.\n\n${formatJobStatus(result)}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: "text",
          text: `Error: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Bankr MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
