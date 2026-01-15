# Changelog

## v1.0.0 - SDK Alignment

Plugin updated to match actual @bankr/sdk implementation.

### Key Details

**API Endpoint**: `https://api-staging.bankr.bot` (default)

**Payment Network**: Base only (for x402 USDC payments)
- Transactions can be on any chain (Base, Ethereum, Polygon, Solana)
- Payments are always on Base

**SDK Methods** (6 total):
1. `prompt()` - Submit job, returns jobId
2. `getJobStatus()` - Check job status (requires signature)
3. `pollJob()` - Poll until complete/failed
4. `promptAndWait()` - **Recommended** - Submit and wait
5. `cancelJob()` - Cancel running job
6. `getWalletAddress()` - Get derived payment address

**Poll Defaults**:
- interval: 2000ms
- maxAttempts: 150
- timeout: 300000ms (5 min)

### 0x Swap Routing

For ERC20 swaps, approve `allowanceTarget` before executing:
- Found in `transaction.metadata.allowanceTarget`
- See: https://0x.org/docs/introduction/0x-cheat-sheet#allowanceholder-recommended
