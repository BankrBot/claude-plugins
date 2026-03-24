# Shulam Compliance Plugin for BankrBot Claude Plugins

## Summary

Adds two advisory commands and a pre-flight hook to the BankrBot Claude plugin ecosystem:

- **`shulam verify <address>`** — Screen a wallet address against OFAC SDN sanctions lists
- **`shulam trust <address>`** — Get a trust score (0–100) with tier and breakdown
- **x402 pre-flight hook** — Automatic advisory compliance check before x402 payments

All commands are **advisory-only** — they print warnings but never block or throw errors.

## How It Works

1. Commands call the Shulam CaaS API (`POST /v1/compliance/screen`, `GET /v1/trust/score/:address`)
2. Results are session-cached (no duplicate API calls within a session)
3. The x402 pre-flight hook runs automatically before payment submission

## Configuration

Set `SHULAM_API_KEY` in your environment. If not set, all checks are silently skipped.

```bash
export SHULAM_API_KEY=your_key_here
```

Free tier: 100 requests/day. Get a key at [api.shulam.xyz/register](https://api.shulam.xyz/register).

## Status Mapping

| API Response | Displayed As | Action |
|-------------|-------------|--------|
| `clear` | CLEAR | No action needed |
| `held` | HELD | Advisory warning |
| `blocked` | BLOCKED | Strong warning |
| `pending` | HELD | Advisory warning |

## Zero Dependencies

All files use raw `fetch` only. No npm packages required.

## Links

- [Shulam Compliance API Docs](https://docs.shulam.xyz/compliance)
- [x402 Protocol](https://x402.org)
- [OFAC SDN List](https://sanctionssearch.ofac.treas.gov/)
