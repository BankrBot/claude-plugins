# RelayShield Security Intelligence — Bankr Plugin

Identity threat intelligence for DeFi agents. Run security checks before executing transactions, evaluating counterparties, or navigating protocol links.

## Tools

| Tool | Use case |
|---|---|
| `relayshield_check_wallet` | Score a wallet for sanctions, darknet, mixer exposure before sending funds |
| `relayshield_check_breach` | Check an email for known data breach exposure |
| `relayshield_check_infostealer` | Detect near-real-time device compromise via infostealer malware logs |
| `relayshield_scan_url` | Scan a DeFi protocol, airdrop, or NFT mint URL for phishing/malware |

## Setup

1. Get a free API key at [rapidapi.com/relayshield/relayshield-security-intelligence](https://rapidapi.com/relayshield/relayshield-security-intelligence)
2. Set `RELAYSHIELD_API_KEY` in your environment
3. Build: `cd mcp-server && npm install && npm run build`

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `RELAYSHIELD_API_KEY` | Yes | RapidAPI subscription key |
| `RELAYSHIELD_API_URL` | No | Override API base URL (default: RapidAPI endpoint) |

## Example usage

```
Before executing a swap: check_wallet on the counterparty address, then scan_url on the protocol link.
```

## Pricing

Free tier: 100 calls/month. Paid plans from $29/month on RapidAPI.
Pay-as-you-go via x402 (USDC on Base or Solana) also supported — contact support@relayshield.net.
