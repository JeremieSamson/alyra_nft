// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title Nft Collection Token Contract
 *
 * @author Jonacity
 *
 * @notice This contract manages the collection tokens
 */
contract CollectionToken is ERC721Enumerable, ERC721URIStorage {
    /**
     * @dev Initial max supply
     */
    uint public maxSupply = 3;

    /**
     * @dev Collection owner
     */
    address public collectionOwner;

    /**
     * @dev Base URI
     */
    string private baseURI;

    /**
     * @dev Market contract address
     */
    address public marketContractAddress;

    /**
     * @dev Token minted event
     */
    event TokenMinted (
        uint tokenId,
        address owner,
        string tokenURI
    );

    /**
     * @notice The constructor
     *
     * @param _collectionName Collection name
     * @param _collectionSymbol Collection symbol
     * @param _newBaseURI Base URI => ipfs://<CID>/
     * @param _marketContractAddress Market contract address
     */
    constructor(
        address _collectionOwner,
        string memory _collectionName,
        string memory _collectionSymbol,
        string memory _newBaseURI,
        address _marketContractAddress
    ) ERC721(_collectionName, _collectionSymbol) {
        collectionOwner = _collectionOwner;
        baseURI = _newBaseURI;
        marketContractAddress = _marketContractAddress;
    }

    modifier isOwner {
        require(msg.sender == collectionOwner, "Not owner");
        _;
    }

    /**
     * @notice Set max supply
     *
     * @param _maxSupply New max supply
     */
    function setMaxSupply(uint _maxSupply) external isOwner {
        require(msg.sender == collectionOwner, "Not owner");
        maxSupply = _maxSupply;
    }

    /**
     * @notice Set market contract address
     *
     * @param _marketContractAddress New market contract address
     */
    function setMarketContractAddress(address _marketContractAddress) external isOwner {
        require(_marketContractAddress != address(0), "Address not valid");

        marketContractAddress = _marketContractAddress;
    }

    /**
     * @notice Get base URI
     *
     * @return Base URI
     */
    function getBaseURI() external view isOwner returns (string memory) {
        return baseURI;
    }

    /**
     * @notice Set base URI
     *
     * @param _newBaseURI New base URI
     */
    function setBaseURI(string memory _newBaseURI) external isOwner {
        baseURI = _newBaseURI;
    }

    /**
     * @notice Mint the whole collection
     */
    function mintCollection(string[] memory tokenMetadataURIs) public isOwner {
        uint totalSupply = totalSupply();
        // string[3] memory tokenMetadataURIs = [
        //     "mojo-jojo.json",
        //     "morpheus.json",
        //     "biggie.json"
        // ];
        require(totalSupply < maxSupply, "Unable to mint more items");

        for (uint i = 0; i < tokenMetadataURIs.length; i++) {
            totalSupply++;
            uint newTokenId = totalSupply;
            super._safeMint(msg.sender, newTokenId);
            super._setTokenURI(newTokenId, tokenMetadataURIs[i]);

            emit TokenMinted(newTokenId, msg.sender, tokenMetadataURIs[i]);
        }

        super.setApprovalForAll(marketContractAddress, true);
    }

    /**
     * @inheritdoc ERC721Enumerable
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc ERC721URIStorage
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @inheritdoc ERC721
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /**
     * @inheritdoc ERC721Enumerable
     */
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /**
     * @inheritdoc ERC721URIStorage
     */
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
