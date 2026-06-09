/**
 * Mint tokens
 *
 * ERC1155:
 *   CONTRACT_ADDRESS=0x... TOKEN_STANDARD=1155 MINT_TO=0x... MINT_TOKEN_ID=1 MINT_AMOUNT=1 \
 *     npx hardhat run scripts/mint.js --network sepolia
 *
 * ERC721:
 *   CONTRACT_ADDRESS=0x... TOKEN_STANDARD=721 MINT_TO=0x... MINT_TOKEN_URI=https://... \
 *     npx hardhat run scripts/mint.js --network sepolia
 */
import hre from "hardhat";

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const TOKEN_STANDARD   = process.env.TOKEN_STANDARD ?? "1155";
const MINT_TO          = process.env.MINT_TO;
const MINT_TOKEN_ID    = process.env.MINT_TOKEN_ID;
const MINT_AMOUNT      = process.env.MINT_AMOUNT ?? "1";
const MINT_TOKEN_URI   = process.env.MINT_TOKEN_URI;

async function main() {
  if (!CONTRACT_ADDRESS || !MINT_TO) {
    console.error("Set CONTRACT_ADDRESS and MINT_TO env vars");
    process.exit(1);
  }

  const [owner] = await hre.ethers.getSigners();
  console.log("Minting as:", owner.address);

  if (TOKEN_STANDARD === "721") {
    if (!MINT_TOKEN_URI) { console.error("Set MINT_TOKEN_URI for ERC721"); process.exit(1); }
    const contract = await hre.ethers.getContractAt("ERC721Base", CONTRACT_ADDRESS);
    const tx = await contract.mint(MINT_TO, MINT_TOKEN_URI);
    const receipt = await tx.wait();
    const event = receipt.logs.find(l => l.fragment?.name === "Transfer");
    const tokenId = event?.args?.[2]?.toString() ?? "?";
    console.log(`Minted ERC721 token ID ${tokenId} → ${MINT_TO}`);
    console.log(`TX: https://sepolia.etherscan.io/tx/${tx.hash}`);
  } else {
    if (!MINT_TOKEN_ID) { console.error("Set MINT_TOKEN_ID for ERC1155"); process.exit(1); }
    const contract = await hre.ethers.getContractAt("ERC1155Base", CONTRACT_ADDRESS);
    const tx = await contract.mint(MINT_TO, MINT_TOKEN_ID, MINT_AMOUNT);
    await tx.wait();
    console.log(`Minted ERC1155 token ID ${MINT_TOKEN_ID} x${MINT_AMOUNT} → ${MINT_TO}`);
    console.log(`TX: https://sepolia.etherscan.io/tx/${tx.hash}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
