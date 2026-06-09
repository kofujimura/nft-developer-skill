# nft-developer-skill

A Hardhat-based NFT development skill for AI coding agents (Claude Code, Codex, and compatible tools).

Provides reusable ERC1155 and ERC721 template contracts with owner-only minting, optional Soulbound mode, and scripts for deploying, minting, and verifying on Etherscan — all driven by natural language.

---

## Features

- **ERC1155Base** — multi-token contract with per-token URI management
- **ERC721Base** — single-token contract with auto-incrementing token IDs
- Both standards support **Soulbound mode** (non-transferable) or standard transferable, selected at deploy time
- Owner-only minting
- Etherscan source verification built in
- Targets **Sepolia testnet** (easily extended to mainnet)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Alchemy](https://dashboard.alchemy.com/) API key (Sepolia RPC)
- [Etherscan](https://etherscan.io/myapikey) API key (for contract verification)
- A funded Sepolia wallet (private key)

---

## Installation

### 1. Clone and install dependencies

```bash
git clone https://github.com/<your-username>/nft-developer-skill.git
cd nft-developer-skill
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
WALLET_PRIVATE_KEY=0x...
WALLET_ADDRESS=0x...
ALCHEMY_API_KEY=your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_key
NETWORK=sepolia
```

> `.env.local` is gitignored. Never commit your private key.

---

## Using with Claude Code

Open this directory in [Claude Code](https://claude.ai/code):

```bash
claude nft-developer-skill/
```

`CLAUDE.md` is automatically loaded, giving Claude full context of the available contracts, scripts, and workflow. You can then give natural language instructions such as:

- *"Deploy an ERC721 NFT called 'Membership Card' with symbol MCARD, soulbound"*
- *"Mint token ID 1 to 0xABCD…"*
- *"Verify the contract on Etherscan"*

### Install as a global skill

To use this skill from any project in Claude Code, copy it to your global skills directory:

```bash
cp -r . ~/.claude/skills/nft-developer-skill
```

Then invoke it from any Claude Code session:

```
/nft-developer-skill
```

---

## Using with Codex

[Codex CLI](https://github.com/openai/codex) automatically loads `AGENTS.md` from the project root. Clone this repository and open it as your working directory:

```bash
codex --directory nft-developer-skill/
```

The agent will have full context of the contracts, deployment workflow, and available commands.

---

## Manual usage

All operations can also be run directly without an AI agent.

### Compile

```bash
npx hardhat compile
```

### Deploy

**ERC1155Base** (e.g. credential / membership tokens):
```bash
CONTRACT=ERC1155Base NAME="My Collection" SOULBOUND=true \
  npx hardhat run scripts/deploy.js --network sepolia
```

**ERC721Base** (e.g. collectible NFTs):
```bash
CONTRACT=ERC721Base NAME="My NFT" SYMBOL="MNFT" SOULBOUND=false \
  npx hardhat run scripts/deploy.js --network sepolia
```

The deploy script prints the exact `hardhat verify` command to run next.

### Verify on Etherscan

```bash
# ERC1155Base
npx hardhat verify --network sepolia <address> "<Name>" <true|false>

# ERC721Base
npx hardhat verify --network sepolia <address> "<Name>" "<SYMBOL>" <true|false>
```

### Set token URI (ERC1155 only)

```bash
npx hardhat console --network sepolia
> const c = await ethers.getContractAt("ERC1155Base", "<address>")
> await c.setTokenURI(1, "https://your-metadata-uri/1")
```

### Mint

**ERC1155:**
```bash
CONTRACT_ADDRESS=0x... TOKEN_STANDARD=1155 \
MINT_TO=0x... MINT_TOKEN_ID=1 MINT_AMOUNT=1 \
  npx hardhat run scripts/mint.js --network sepolia
```

**ERC721:**
```bash
CONTRACT_ADDRESS=0x... TOKEN_STANDARD=721 \
MINT_TO=0x... MINT_TOKEN_URI=https://your-metadata-uri/1 \
  npx hardhat run scripts/mint.js --network sepolia
```

---

## Contract reference

### ERC1155Base

| Function | Access | Description |
|---|---|---|
| `setTokenURI(id, uri)` | owner | Set metadata URI for a token ID |
| `mint(to, id, amount)` | owner | Mint tokens to an address |
| `mintBatch(to, ids, amounts)` | owner | Mint multiple token types at once |
| `uri(id)` | public | Returns metadata URI for a token ID |

Constructor: `ERC1155Base(string name, bool soulbound)`

### ERC721Base

| Function | Access | Description |
|---|---|---|
| `mint(to, tokenURI)` | owner | Mint one token with URI; returns token ID |
| `tokenURI(id)` | public | Returns metadata URI for a token |

Constructor: `ERC721Base(string name, string symbol, bool soulbound)`

---

## Soulbound mode

Pass `soulbound=true` at deploy time to make tokens non-transferable after minting. Useful for credentials, memberships, and certificates. The flag is stored as an `immutable` and cannot be changed after deployment.

---

## License

MIT
