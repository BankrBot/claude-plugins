# bankr-agent-dev

Developer toolkit for building applications on top of the Bankr Agent API.

## Overview

This plugin helps developers scaffold and build applications that interact with the Bankr Agent API. Whether you're building a trading bot, portfolio dashboard, prediction market tracker, or any other crypto/DeFi application, this plugin provides the starting point.

## Features

- **Scaffold Command**: Generate complete project templates for various application types
- **API Knowledge**: Skill with essential Bankr API patterns and documentation

## Prerequisites

- Bankr API key (get one at https://bankr.bot/api)
- Node.js 18+ and npm/bun

## Installation

```bash
claude plugins marketplace add BankrBot/claude-plugins
claude plugins install bankr-agent-dev@bankr-claude-plugins
```

## Usage

### Scaffold a New Project

```bash
/bankr-agent-dev:scaffold
```

This command will guide you through creating a new project that uses the Bankr Agent API. Choose from:

- **Bot**: Automated trading bot, price monitor, or alert system
- **Web Service**: HTTP API that wraps or extends Bankr functionality
- **Dashboard**: Web UI for portfolio tracking, market analysis, etc.
- **CLI Tool**: Command-line application for Bankr operations

## Environment Variables

Your scaffolded projects will need:

```bash
export BANKR_API_KEY=bk_your_api_key_here
```

The API key is tied to your Bankr account and wallet.

## About the Bankr Agent API

The Bankr Agent API uses an asynchronous job pattern:

1. **Submit a prompt** → Get a job ID
2. **Poll for status** → Check progress every 2 seconds
3. **Get results** → Receive response, transactions, rich data

Supported operations include:
- Crypto trading (buy, sell, swap) across multiple chains
- Price queries and market analysis
- Polymarket predictions (odds, betting)
- DeFi protocol queries (TVL, yields)

## Related

- [bankr-agent](../bankr-agent) - Claude Code integration for using Bankr
- [Bankr API Docs](https://docs.bankr.bot)
