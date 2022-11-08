// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Enumerable.sol";
import "./Ownable.sol";

contract NFT is ERC721Enumerable, Ownable {
    uint256 public cost;
    uint256 public maxSupply;
    uint256 public allowMintingOn;
    string public baseURI;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _cost,
        uint256 _maxSupply,
        uint256 _allowMintingOn,
        string memory _baseURI
    ) ERC721(_name, _symbol) {
        cost = _cost;
        maxSupply = _maxSupply;
        allowMintingOn = _allowMintingOn;
        baseURI = _baseURI;
    }

    event Mint(uint256 amount, address minter);

    // Mint multiple NFTs
    function mint(uint256 _mintAmount) public payable {
        // Only allow minting after specified time
        require(block.timestamp >= allowMintingOn);

        // Must mint at least one token
        require(_mintAmount > 0, "must mint at least one token");

        // Must have enough funds to mint
        require(msg.value >= cost * _mintAmount);

        uint256 supply = totalSupply();

        // Mint amount cannot exceed max supply
        require(supply + _mintAmount <= maxSupply, "mint exceeds max supply");

        // Create token(s)
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
        }

        // Emit event
        emit Mint(_mintAmount, msg.sender);
    }
}
