// SPDX-License-Identifier: MIT

pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title Nft Collection Market contract
 *
 * @author Jonacity
 *
 * @notice This contract manages the collection market
 */
contract CollectionMarket is ERC721Holder, Ownable {
    using Counters for Counters.Counter;

    /**
     * @notice A counter for item ids
     */
    Counters.Counter private itemId;

    /**
     * @notice A counter for sold items count
     */
    Counters.Counter private itemSoldCount;

    /**
     * @dev From item id to item map
     */
    mapping(uint => Item) private items;

    /**
     * @dev Item struct
     */
    struct Item {
        uint itemId;
        uint tokenId;
        uint price;
        address tokenContractAddress;
        address payable seller;
        address payable owner;
    }

    /**
     * @dev Item created event
     */
    event ItemCreated (
        uint itemId,
        uint tokenId,
        uint price,
        address tokenContractAddress,
        address seller,
        address owner
    );

    /**
     * @notice Add a new item to items and transfer the token
     *
     * @param _tokenContractAddress Token contract address
     * @param _tokenId Token id
     * @param _price Price
     */
    function addItem(address _tokenContractAddress, uint _tokenId, uint _price)
        external
        payable
        onlyOwner
    {
        require(_price > 0, "No ETH sent");

        itemId.increment();
        uint currentItemId = itemId.current();
        items[currentItemId] = Item(
            currentItemId,
            _tokenId,
            _price,
            _tokenContractAddress,
            payable(msg.sender),
            payable(address(0))
        );
        IERC721(_tokenContractAddress).safeTransferFrom(msg.sender, address(this), _tokenId);

        emit ItemCreated(
            currentItemId,
            _tokenId,
            _price,
            _tokenContractAddress,
            msg.sender,
            address(0)
        );
    }

    /**
     * @notice Buy the item and transfer the ownership
     */
    function buyItem(address _tokenContractAddress, uint _itemId) external payable {
        uint price = items[_itemId].price;
        uint tokenId = items[_itemId].tokenId;
        require(msg.value == price, "Wrong price for this item");

        itemSoldCount.increment();
        items[_itemId].owner = payable(msg.sender);
        items[_itemId].seller.transfer(msg.value);
        IERC721(_tokenContractAddress).transferFrom(address(this), msg.sender, tokenId);
    }

    /**
     * @notice Get sender's collection items
     *
     * @return Sender collection items
     */
    function getSenderItems() external view returns (Item[] memory) {
        uint totalItem = itemId.current();
        uint totalSenderItems = 0;
        uint senderItemsIndex = 0;

        for (uint i = 0; i < totalItem; i++) {
            if (items[i + 1].owner == msg.sender) {
                totalSenderItems++;
            }
        }

        Item[] memory senderItems = new Item[](totalSenderItems);

        for (uint i = 0; i < totalItem; i++) {
            if (items[i + 1].owner == msg.sender) {
                Item memory currentItem = items[i + 1];
                senderItems[senderItemsIndex] = currentItem;
                senderItemsIndex++;
            }
        }

        return senderItems;
    }

    /**
     * @notice Get unsold items
     *
     * @return Unsold items list
     */
    function getUnsoldItems() external view returns (Item[] memory) {
        uint totalItem = itemId.current();
        uint totalUnsoldItems = totalItem - itemSoldCount.current();
        uint unsoldItemsIndex = 0;
        Item[] memory unsoldItems = new Item[](totalUnsoldItems);

        for (uint i = 0; i < totalItem; i++) {
            if (items[i + 1].owner == address(0)) {
                Item memory currentItem = items[i + 1];
                unsoldItems[unsoldItemsIndex] = currentItem;
                unsoldItemsIndex++;
            }
        }

        return unsoldItems;
    }

    /**
     * @notice Get item by id
     *
     * @param _itemId Item id
     *
     * @return Item
     */
    function getItemById(uint _itemId) external view returns (Item memory) {
        return items[_itemId];
    }
}
