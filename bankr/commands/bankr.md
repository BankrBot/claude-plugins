---
description: Send a query to Bankr for crypto, trading, or Polymarket operations
argument-hint: [query]
---

Send the following query to the Bankr API: $ARGUMENTS

Use the bankr agent workflow:
1. Submit the query using `bankr_submit_prompt`
2. Poll for status using `bankr_get_job_status` every 1-2 seconds
3. Report status updates to the user as they come in
4. When complete, share the final response

If no query is provided, ask the user what they'd like to do with Bankr (crypto trading, price checks, market analysis, or Polymarket predictions).
