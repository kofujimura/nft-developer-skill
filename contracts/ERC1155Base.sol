// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * ERC1155Base — Multi-token NFT template
 *
 * - Owner-only mint
 * - Per-token URI managed by owner (setTokenURI)
 * - Soulbound mode: set soulbound=true in constructor to disable transfers
 */
contract ERC1155Base is ERC1155, Ownable {
    string public name;
    bool public immutable soulbound;

    mapping(uint256 => string) private _tokenURIs;

    error Soulbound();
    error UnknownTokenId(uint256 id);

    constructor(string memory name_, bool soulbound_)
        ERC1155("")
        Ownable(msg.sender)
    {
        name = name_;
        soulbound = soulbound_;
    }

    function setTokenURI(uint256 id, string calldata tokenURI_) external onlyOwner {
        _tokenURIs[id] = tokenURI_;
    }

    function uri(uint256 id) public view override returns (string memory) {
        string memory u = _tokenURIs[id];
        if (bytes(u).length == 0) revert UnknownTokenId(id);
        return u;
    }

    function mint(address to, uint256 id, uint256 amount) external onlyOwner {
        _mint(to, id, amount, "");
    }

    function mintBatch(
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts
    ) external onlyOwner {
        _mintBatch(to, ids, amounts, "");
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override {
        if (soulbound && from != address(0)) revert Soulbound();
        super._update(from, to, ids, values);
    }
}
