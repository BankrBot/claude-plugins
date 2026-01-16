---
description: Scaffold a new project that uses the Bankr Agent API
argument-hint: [project-type]
allowed-tools: Read, Write, Bash, AskUserQuestion, Glob, Grep
---

# Bankr Project Scaffold

Create a complete TypeScript/Node.js project scaffold for building on the Bankr Agent API.

## Process

1. **Determine project type** - If `$ARGUMENTS` specifies a type, use it. Otherwise, ask the user:

Available project types:
- **bot** - Automated trading bot, price monitor, alert system, or scheduled task
- **web-service** - HTTP API that wraps or extends Bankr functionality
- **dashboard** - Web UI for portfolio tracking, market analysis, or monitoring
- **cli** - Command-line tool for Bankr operations

2. **Ask for project details**:
   - Project name (kebab-case, e.g., `my-trading-bot`)
   - Brief description of what it will do
   - Any specific Bankr operations it will use (trading, prices, polymarket, defi)

3. **Create project structure** using the appropriate template below.

4. **Explain next steps** - How to set up API key, install dependencies, and run.

---

## Project Templates

### Bot Template

For automated bots, monitors, and scheduled tasks:

```
{project-name}/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── index.ts           # Main entry point with scheduler
│   ├── bankr-client.ts    # Bankr API client
│   ├── types.ts           # TypeScript interfaces
│   └── config.ts          # Configuration loading
└── scripts/
    └── run.sh             # Convenience script
```

**Key features:**
- Polling loop with configurable interval
- Status update streaming
- Error handling and retries
- Environment-based configuration

### Web Service Template

For HTTP APIs that extend Bankr:

```
{project-name}/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── index.ts           # Server entry point
│   ├── server.ts          # Express/Fastify server setup
│   ├── routes/
│   │   ├── health.ts      # Health check endpoint
│   │   └── bankr.ts       # Bankr proxy/extension routes
│   ├── bankr-client.ts    # Bankr API client
│   ├── types.ts           # TypeScript interfaces
│   └── config.ts          # Configuration loading
└── scripts/
    └── run.sh
```

**Key features:**
- REST API endpoints
- Request validation
- Async job handling
- Webhook support for job completion

### Dashboard Template

For web UIs with frontend and backend:

```
{project-name}/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
├── server/
│   ├── index.ts           # Backend server
│   ├── bankr-client.ts    # Bankr API client
│   ├── routes/
│   │   └── api.ts         # API routes for frontend
│   └── types.ts
├── public/
│   ├── index.html         # Main HTML page
│   ├── styles.css         # Basic styles
│   └── app.js             # Frontend JavaScript
└── scripts/
    └── run.sh
```

**Key features:**
- Simple HTML/CSS/JS frontend (no build step required)
- Backend API for Bankr operations
- Real-time status updates via polling
- Portfolio/market data display

### CLI Template

For command-line tools:

```
{project-name}/
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
├── README.md
├── src/
│   ├── index.ts           # CLI entry with commander.js
│   ├── commands/
│   │   ├── trade.ts       # Trading commands
│   │   ├── price.ts       # Price query commands
│   │   └── status.ts      # Job status commands
│   ├── bankr-client.ts    # Bankr API client
│   └── types.ts
└── scripts/
    └── run.sh
```

**Key features:**
- Commander.js CLI framework
- Subcommands for different operations
- Interactive prompts where needed
- Progress indicators during polling

---

## Common Files

### package.json

```json
{
  "name": "{project-name}",
  "version": "0.1.0",
  "description": "{description}",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx src/index.ts"
  },
  "dependencies": {
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.0"
  }
}
```

Add framework-specific dependencies based on project type:
- **web-service**: Add `express` or `fastify`
- **cli**: Add `commander`
- **dashboard**: Add `express` for backend

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### .env.example

```
BANKR_API_KEY=bk_your_api_key_here
BANKR_API_URL=https://api.bankr.bot
```

### .gitignore

```
node_modules/
dist/
.env
*.log
```

### bankr-client.ts (Core Module)

This is the essential Bankr API client that all project types share:

```typescript
import "dotenv/config";

const API_URL = process.env.BANKR_API_URL || "https://api.bankr.bot";
const API_KEY = process.env.BANKR_API_KEY;

// Types
export interface JobStatusResponse {
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

export interface Transaction {
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

export interface StatusUpdate {
  message: string;
  timestamp: string;
}

export interface RichData {
  type: string;
  base64?: string;
  url?: string;
}

// API Functions
export async function submitPrompt(prompt: string): Promise<{ jobId: string }> {
  if (!API_KEY) throw new Error("BANKR_API_KEY not set");

  const response = await fetch(`${API_URL}/agent/prompt`, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  if (!data.success) throw new Error(data.error || "Failed to submit prompt");
  return { jobId: data.jobId };
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  if (!API_KEY) throw new Error("BANKR_API_KEY not set");

  const response = await fetch(`${API_URL}/agent/job/${jobId}`, {
    headers: { "x-api-key": API_KEY },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${await response.text()}`);
  }

  return response.json();
}

export async function waitForCompletion(
  jobId: string,
  onProgress?: (msg: string) => void
): Promise<JobStatusResponse> {
  let lastUpdateCount = 0;

  for (let i = 0; i < 120; i++) {
    const status = await getJobStatus(jobId);

    // Report new status updates
    if (onProgress && status.statusUpdates) {
      for (let j = lastUpdateCount; j < status.statusUpdates.length; j++) {
        onProgress(status.statusUpdates[j].message);
      }
      lastUpdateCount = status.statusUpdates.length;
    }

    if (["completed", "failed", "cancelled"].includes(status.status)) {
      return status;
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("Job timed out");
}

export async function execute(
  prompt: string,
  onProgress?: (msg: string) => void
): Promise<JobStatusResponse> {
  const { jobId } = await submitPrompt(prompt);
  onProgress?.(`Job submitted: ${jobId}`);
  return waitForCompletion(jobId, onProgress);
}
```

---

## Implementation Notes

When scaffolding:

1. **Create all directories first** using mkdir -p
2. **Write each file** using the Write tool
3. **Customize based on user's description** - adjust the example code to match their use case
4. **Include helpful comments** in the generated code
5. **Generate a README.md** with:
   - Project description
   - Setup instructions (npm install, configure .env)
   - Usage examples
   - Bankr API reference link

After scaffolding, explain:
- How to get a Bankr API key (https://bankr.bot/api)
- How to run the project (`npm install && npm run dev`)
- What to customize first based on their use case
