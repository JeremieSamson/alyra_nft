// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

// importing the ERC-721 contract to deploy for an collection
import "./CollectionToken.sol";

/**
  * @notice Give the ability to deploy a contract to manage ERC-721 tokens for an collection. S/O @Snow
  * @dev    If the contract is already deployed for an _collectionName, it will revert.
  */
contract CollectionFactory {

    event NFTCollectionCreated(string _collectionName, address _collectionAddress, uint _timestamp);

    /**
      * @notice Deploy the ERC-721 Collection contract of the collection caller to be able to create NFTs later
      *
      * @return collectionAddress the address of the created collection contract
      */
    function createNFTCollection(
        string memory _collectionName,
        string memory _collectionSymbol,
        string memory _baseURI,
        address _marketContractAddress
    ) external returns (address collectionAddress) {
        CollectionToken newCollection = new CollectionToken(msg.sender, _collectionName, _collectionSymbol, _baseURI, _marketContractAddress);

        collectionAddress = address(newCollection);
        emit NFTCollectionCreated(_collectionName, collectionAddress, block.timestamp);
        return collectionAddress;
    }
}
