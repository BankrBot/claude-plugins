---
description: Send a query to Bankr for crypto, trading, or Polymarket operations
argument-hint: [query]
---

Send the following query to the Bankr API: $ARGUMENTS

**IMPORTANT: You MUST load the skills to get the API commands and correct prompt format.**

1. First, identify the operation type and load the matching skill:
   - Trading (buy/sell/swap): `bankr-token-trading`
   - Transfers (send to address/ENS/@handle): `bankr-transfers`
   - Polymarket (bets/odds/positions): `bankr-polymarket`
   - Leverage (long/short/Avantis): `bankr-leverage-trading`
   - NFTs (browse/buy): `bankr-nft-operations`
   - Portfolio (balances/holdings): `bankr-portfolio`
   - Research (prices/analysis/sentiment): `bankr-market-research`
   - Automation (limit orders/DCA/stop-loss): `bankr-automation`
   - Token deployment (Clanker): `bankr-token-deployment`
   - Raw transactions/calldata/arbitrary tx: `bankr-arbitrary-transaction`

2. **REQUIRED**: Load `bankr-job-workflow` skill - this contains the curl commands to call the API:
   - Submit the query using the curl POST command
   - Poll for status using the curl GET command every 2 seconds
   - Report status updates to the user as they come in
   - When complete, share the final response

If errors occur, consult the `bankr-error-handling` skill.

If no query is provided, ask the user what they'd like to do with Bankr (crypto trading, price checks, market analysis, Polymarket predictions, etc.).
