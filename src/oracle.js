/**
 * AgentProof Oracle API client.
 * Wraps the REST API at oracle.agentproof.sh.
 */

const BASE_URL = process.env.AGENTPROOF_BASE_URL || "https://oracle.agentproof.sh";

async function getTrustScore(agentAddress) {
  const res = await fetch(`${BASE_URL}/api/v1/trust/${agentAddress}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oracle returned ${res.status}: ${text}`);
  }
  return res.json();
}

async function getLeaderboard(chain = "arbitrum", limit = 10) {
  const res = await fetch(
    `${BASE_URL}/api/v1/leaderboard?chain=${chain}&limit=${limit}`
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oracle returned ${res.status}: ${text}`);
  }
  return res.json();
}

async function getNetworkStats() {
  const res = await fetch(`${BASE_URL}/api/v1/network/stats`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Oracle returned ${res.status}: ${text}`);
  }
  return res.json();
}

async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/network/stats`, {
      signal: AbortSignal.timeout(5000),
    });
    return { reachable: res.ok, status: res.status };
  } catch {
    return { reachable: false, status: 0 };
  }
}

module.exports = { getTrustScore, getLeaderboard, getNetworkStats, checkHealth };
