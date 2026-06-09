// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ERC721Base — Single-token NFT template
 *
 * - Owner-only mint with auto-incrementing token ID
 * - Per-token URI set at mint time
 * - Soulbound mode: set soulbound=true in constructor to disable transfers
 */
contract ERC721Base is ERC721URIStorage, Ownable {
    bool public immutable soulbound;
    uint256 private _nextTokenId;

    error Soulbound();

    constructor(string memory name_, string memory symbol_, bool soulbound_)
        ERC721(name_, symbol_)
        Ownable(msg.sender)
    {
        soulbound = soulbound_;
    }

    function mint(address to, string calldata tokenURI_) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        return tokenId;
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override returns (address) {
        address from = _ownerOf(tokenId);
        if (soulbound && from != address(0)) revert Soulbound();
        return super._update(to, tokenId, auth);
    }
}
