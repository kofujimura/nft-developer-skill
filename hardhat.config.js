import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ALCHEMY_API_KEY   = process.env.ALCHEMY_API_KEY   || "";
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY ||
  "0x0000000000000000000000000000000000000000000000000000000000000001";
const ETHERSCAN_API_KEY  = process.env.ETHERSCAN_API_KEY  || "";

export default {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "cancun",
    },
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [WALLET_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
