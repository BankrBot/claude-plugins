# Basic Token Swap

Build and execute a token swap with the Bankr SDK.

## Setup

```bash
npm install @bankr/sdk viem dotenv

# .env
BANKR_PRIVATE_KEY=0x...  # Needs USDC on Base for payments
BANKR_WALLET_ADDRESS=0x... # Receives swapped tokens
TRADING_WALLET_PK=0x...  # Executes transactions
```

## Code

```typescript
import { BankrClient } from "@bankr/sdk";
import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import "dotenv/config";

async function main() {
  // 1. Initialize SDK
  const client = new BankrClient({
    privateKey: process.env.BANKR_PRIVATE_KEY as `0x${string}`,
    walletAddress: process.env.BANKR_WALLET_ADDRESS,
  });

  console.log(`Payment wallet: ${client.getWalletAddress()}`);

  // 2. Build swap
  const result = await client.promptAndWait({
    prompt: "Swap 0.1 ETH to USDC on Base",
  });

  if (result.status !== "completed") {
    throw new Error(`Failed: ${result.error}`);
  }

  console.log(result.response);

  // 3. Get transaction
  const swapTx = result.transactions?.find(tx => tx.type === "swap");
  if (!swapTx) throw new Error("No swap transaction");

  const txData = swapTx.metadata.transaction;
  console.log(`Chain: ${swapTx.metadata.__ORIGINAL_TX_DATA__.chain}`);
  console.log(`Input: ${swapTx.metadata.__ORIGINAL_TX_DATA__.inputTokenAmount} ${swapTx.metadata.__ORIGINAL_TX_DATA__.inputTokenTicker}`);

  // 4. Check approval requirement
  if (swapTx.metadata.allowanceTarget) {
    console.log(`Approve ${swapTx.metadata.allowanceTarget} first`);
  }

  // 5. Execute (set to true to run)
  const shouldExecute = false;
  if (shouldExecute) {
    const account = privateKeyToAccount(process.env.TRADING_WALLET_PK as `0x${string}`);
    const walletClient = createWalletClient({ account, chain: base, transport: http() });

    const hash = await walletClient.sendTransaction({
      to: txData.to as `0x${string}`,
      data: txData.data as `0x${string}`,
      value: BigInt(txData.value),
      gas: BigInt(txData.gas),
    });

    console.log(`Sent: ${hash}`);

    const publicClient = createPublicClient({ chain: base, transport: http() });
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Confirmed: ${receipt.status}`);
  }
}

main().catch(console.error);
```

## Run

```bash
bun run basic-swap.ts
```

## Cost

- API: $0.10 USDC (x402)
- Gas: ~$0.01-0.05 (Base)

## Notes

- For ERC20 swaps, approve `allowanceTarget` before executing
- SDK uses 0x Protocol for routing
- Payment wallet and trading wallet can be different
