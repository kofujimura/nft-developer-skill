/**
 * Deploy ERC1155Base or ERC721Base
 *
 * ERC1155Base:
 *   CONTRACT=ERC1155Base NAME="My Collection" SOULBOUND=true \
 *     npx hardhat run scripts/deploy.js --network sepolia
 *
 * ERC721Base:
 *   CONTRACT=ERC721Base NAME="My NFT" SYMBOL="MNFT" SOULBOUND=false \
 *     npx hardhat run scripts/deploy.js --network sepolia
 */
import hre from "hardhat";

const CONTRACT  = process.env.CONTRACT;
const NAME      = process.env.NAME;
const SYMBOL    = process.env.SYMBOL   ?? "";
const SOULBOUND = process.env.SOULBOUND === "true";

async function main() {
  if (!CONTRACT || !NAME) {
    console.error("Set CONTRACT and NAME env vars");
    process.exit(1);
  }

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log(`Contract: ${CONTRACT} | Name: "${NAME}" | Soulbound: ${SOULBOUND}`);

  const Factory = await hre.ethers.getContractFactory(CONTRACT);
  const args = CONTRACT === "ERC721Base"
    ? [NAME, SYMBOL, SOULBOUND]
    : [NAME, SOULBOUND];

  const contract = await Factory.deploy(...args);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`${CONTRACT} deployed to: ${address}`);
  console.log(`Explorer: https://sepolia.etherscan.io/address/${address}`);
  console.log(`\nVerify: npx hardhat verify --network sepolia ${address} "${NAME}"${CONTRACT === "ERC721Base" ? ` "${SYMBOL}"` : ""} ${SOULBOUND}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
