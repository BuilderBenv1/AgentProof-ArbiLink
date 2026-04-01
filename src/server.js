require("dotenv").config();

const express = require("express");
const { getTrustScore, getLeaderboard, checkHealth } = require("./oracle");
const { registerAgent, isRegistered, REGISTRY_ADDRESS } = require("./registry");

const app = express();
app.use(express.json());

// --- GET /trust-score/:agentAddress ---
app.get("/trust-score/:agentAddress", async (req, res) => {
  const { agentAddress } = req.params;

  try {
    // Check Arbitrum registry status
    const registryStatus = await isRegistered(agentAddress);

    // Query AgentProof oracle
    const trustData = await getTrustScore(agentAddress);

    res.json({
      agent: agentAddress,
      registry: {
        chain: "arbitrum-one",
        contract: REGISTRY_ADDRESS,
        ...registryStatus,
      },
      trust: trustData,
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// --- POST /register ---
app.post("/register", async (req, res) => {
  const { agentAddress, metadata } = req.body || {};
  const agentURI = metadata || `https://oracle.agentproof.sh/api/v1/trust/${agentAddress || "self"}`;

  try {
    const result = await registerAgent(agentURI);

    if (result.alreadyRegistered) {
      return res.json({
        status: "already_registered",
        chain: "arbitrum-one",
        contract: REGISTRY_ADDRESS,
        ...result,
      });
    }

    res.status(201).json({
      status: "registered",
      chain: "arbitrum-one",
      contract: REGISTRY_ADDRESS,
      ...result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- GET /leaderboard ---
app.get("/leaderboard", async (req, res) => {
  try {
    const data = await getLeaderboard("arbitrum", 10);
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// --- GET /health ---
app.get("/health", async (req, res) => {
  const oracle = await checkHealth();
  res.json({
    status: "ok",
    skill: "agentproof-arbilink",
    version: "1.0.0",
    oracle,
    registry: {
      chain: "arbitrum-one",
      contract: REGISTRY_ADDRESS,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AgentProof ArbiLink listening on :${PORT}`);
});
