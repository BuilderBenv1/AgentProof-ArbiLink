/**
 * Arbitrum One ERC-8004 IdentityRegistry interaction.
 * Contract: 0x8004A169FB4a3325136EB29fA0ceB6D2e539a432
 */

const { ethers } = require("ethers");

const REGISTRY_ADDRESS = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432";

// Minimal ABI for ERC-8004 IdentityRegistry
const REGISTRY_ABI = [
  "function register(string calldata agentURI) external returns (uint256)",
  "function agentIdOf(address owner) external view returns (uint256)",
  "function agentURI(uint256 agentId) external view returns (string)",
  "function ownerOf(uint256 agentId) external view returns (address)",
  "event Registered(uint256 indexed agentId, address indexed owner, string agentURI)",
];

function getProvider() {
  const rpc = process.env.ARBITRUM_RPC_URL || "https://arb1.arbitrum.io/rpc";
  return new ethers.JsonRpcProvider(rpc);
}

function getSigner() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY not set — cannot sign transactions");
  }
  return new ethers.Wallet(process.env.PRIVATE_KEY, getProvider());
}

function getRegistry(signerOrProvider) {
  return new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signerOrProvider);
}

/**
 * Register an agent on the Arbitrum ERC-8004 registry.
 * Returns { txHash, agentId }.
 */
async function registerAgent(agentURI) {
  const signer = getSigner();
  const registry = getRegistry(signer);

  // Check if this wallet is already registered
  try {
    const existingId = await registry.agentIdOf(signer.address);
    if (existingId > 0n) {
      return {
        alreadyRegistered: true,
        agentId: existingId.toString(),
        owner: signer.address,
      };
    }
  } catch {
    // Not registered yet — proceed
  }

  const tx = await registry.register(agentURI);
  const receipt = await tx.wait();

  // Parse the Registered event
  let agentId = null;
  for (const log of receipt.logs) {
    try {
      const parsed = registry.interface.parseLog(log);
      if (parsed && parsed.name === "Registered") {
        agentId = parsed.args.agentId.toString();
        break;
      }
    } catch {
      // Skip unparseable logs
    }
  }

  return {
    txHash: receipt.hash,
    agentId,
    owner: signer.address,
    blockNumber: receipt.blockNumber,
  };
}

/**
 * Check if an address is registered on the Arbitrum registry.
 */
async function isRegistered(address) {
  const provider = getProvider();
  const registry = getRegistry(provider);

  try {
    const agentId = await registry.agentIdOf(address);
    if (agentId > 0n) {
      const uri = await registry.agentURI(agentId);
      return { registered: true, agentId: agentId.toString(), agentURI: uri };
    }
  } catch {
    // Not registered
  }

  return { registered: false };
}

module.exports = {
  registerAgent,
  isRegistered,
  REGISTRY_ADDRESS,
};
