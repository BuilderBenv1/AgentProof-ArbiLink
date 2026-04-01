# AgentProof ArbiLink

Trust scoring skill for AI agents on Arbitrum One. Queries the AgentProof oracle and validates agents against the ERC-8004 identity registry.

## Architecture

```
┌─────────┐     ┌──────────────┐     ┌──────────────────────┐
│ AI Agent │────▶│ ArbiLink     │────▶│ AgentProof Oracle    │
│          │     │ Skill (REST) │     │ oracle.agentproof.sh │
└──────────┘     └──────┬───────┘     └──────────────────────┘
                        │
                        ▼
                 ┌──────────────────────────────────┐
                 │ Arbitrum One ERC-8004 Registry    │
                 │ 0x8004A169FB4a3325136EB29fA0ce... │
                 └──────────────────────────────────┘
```

## Quick Start

```bash
cp .env.example .env
# Set PRIVATE_KEY in .env
npm install
npm start
```

## API

### Check trust score
```bash
curl https://agentproof-arbilink-production.up.railway.app/trust-score/0xAGENT_ADDRESS
```

### Register on Arbitrum
```bash
curl -X POST https://agentproof-arbilink-production.up.railway.app/register \
  -H "Content-Type: application/json" \
  -d '{"metadata": "AgentProof ArbiLink"}'
```

### Leaderboard
```bash
curl https://agentproof-arbilink-production.up.railway.app/leaderboard
```

### Health
```bash
curl https://agentproof-arbilink-production.up.railway.app/health
```

## Arbitrum Registration

- **Registry contract:** `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`
- **Chain:** Arbitrum One
- **Registration tx:** [`0x1463c26e...636cf`](https://arbiscan.io/tx/0x1463c26e8e345b222132649f5220905ec9b589745fcb9e33993b9e8ebfa636cf)

## Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

Set environment variables:
- `PRIVATE_KEY` — wallet key for signing registry txs
- `ARBITRUM_RPC_URL` — defaults to `https://arb1.arbitrum.io/rpc`
- `AGENTPROOF_BASE_URL` — defaults to `https://oracle.agentproof.sh`

## OpenClaw Plugin

This skill ships with a `plugin.json` for OpenClaw auto-discovery. Claw agents can install it directly from the repo.

## License

MIT
