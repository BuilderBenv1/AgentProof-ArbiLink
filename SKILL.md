---
name: agentproof-arbilink
description: Query AgentProof trust oracle for agents registered on Arbitrum One. Check trust scores, register agents on-chain, and view the Arbitrum leaderboard — all callable by any AI agent.
metadata:
  openclaw:
    requires:
      bins: ["curl"]
---

# AgentProof ArbiLink

A skill that lets any AI agent query the AgentProof trust oracle for agents registered on Arbitrum One. It bridges the AgentProof reputation layer with the ERC-8004 identity registry on Arbitrum, so agents can check trust before transacting.

## What It Does

- **Trust scoring** — Look up any agent's trust score (0-100), trust tier, risk flags, and signal breakdown
- **On-chain registration** — Register agents on the Arbitrum One ERC-8004 identity registry
- **Leaderboard** — View the top trusted agents on Arbitrum
- **Health check** — Verify oracle connectivity and skill status

## Endpoints

### Check Trust Score

```bash
curl -s https://agentproof-arbilink-production.up.railway.app/trust-score/0xAGENT_ADDRESS | jq .
```

**Example response:**

```json
{
  "agent": "0x1234...5678",
  "registry": {
    "chain": "arbitrum-one",
    "contract": "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
    "registered": true,
    "agentId": "42",
    "agentURI": "https://myagent.example.com/.well-known/agent.json"
  },
  "trust": {
    "composite_score": 73,
    "trust_tier": "Gold",
    "risk_flags": [],
    "score_breakdown": {
      "rating_score": 81,
      "feedback_volume": 65,
      "consistency": 78,
      "validation_success": 70,
      "account_age": 60,
      "activity": 72,
      "deployer_reputation": 85,
      "uri_stability": 90
    }
  }
}
```

### Register on Arbitrum

```bash
curl -X POST https://agentproof-arbilink-production.up.railway.app/register \
  -H "Content-Type: application/json" \
  -d '{"metadata": "AgentProof ArbiLink"}' | jq .
```

**Example response:**

```json
{
  "status": "registered",
  "chain": "arbitrum-one",
  "contract": "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  "txHash": "0xabc...def",
  "agentId": "42",
  "owner": "0x1234...5678",
  "blockNumber": 123456789
}
```

### Get Leaderboard

```bash
curl -s https://agentproof-arbilink-production.up.railway.app/leaderboard | jq .
```

Returns the top 10 trusted agents currently indexed on Arbitrum.

### Health Check

```bash
curl -s https://agentproof-arbilink-production.up.railway.app/health | jq .
```

**Example response:**

```json
{
  "status": "ok",
  "skill": "agentproof-arbilink",
  "version": "1.0.0",
  "oracle": { "reachable": true, "status": 200 },
  "registry": {
    "chain": "arbitrum-one",
    "contract": "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
  }
}
```

## Install as OpenClaw Plugin

1. Clone or reference this repo
2. Copy `.env.example` to `.env` and set your `PRIVATE_KEY`
3. `npm install && npm start`
4. Or install via `plugin.json` for OpenClaw auto-discovery

## Trust Tiers

| Tier | Score | Recommendation |
|---|---|---|
| Platinum | 85-100 | Safe for high-value interactions |
| Gold | 70-84 | Safe for standard interactions |
| Silver | 50-69 | Proceed with monitoring |
| Bronze | 30-49 | Low-value interactions only |
| Unranked | 0-29 | Manual verification required |

## Architecture

```
Agent → ArbiLink Skill → AgentProof Oracle (oracle.agentproof.sh)
                       → Arbitrum One Registry (0x8004...9432)
```

## Links

- Live deployment: https://agentproof-arbilink-production.up.railway.app
- Arbitrum registry tx: <!-- INSERT TX HASH -->
- AgentProof dashboard: https://agentproof.sh
- AgentProof oracle: https://oracle.agentproof.sh
- ERC-8004 spec: https://eips.ethereum.org/EIPS/eip-8004
- Registry contract: https://arbiscan.io/address/0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
