const CollectionToken = artifacts.require('CollectionToken')
const CollectionMarket = artifacts.require('CollectionMarket')
const { expect } = require('chai')
const { BN, expectRevert, expectEvent, ether, constants } = require('@openzeppelin/test-helpers')

contract('Collection market test', accounts => {
    const owner = accounts[0]
    const user = accounts[1]
    const buyer = accounts[2]
    let collectionTokenInstance
    let collectionMarketInstance
    const baseUri = 'ipfs://QmfQYC1s6n77SmCSyqcXbYcJNwXQ1so9EUVUEKtWvxrhVL/'
    const tokenMetadataURIs = [
        'mojo-jojo.json',
        'morpheus.json',
        'biggie.json'
    ]
    const price = 1

    expectBN = (number1, number2) => expect(number1).to.bignumber.equal(new BN(number2))

    describe('CollectionMarket', () => {
        beforeEach(async () => {
            collectionMarketInstance = await CollectionMarket.new({ from: owner })
            collectionTokenInstance = await CollectionToken.new(baseUri, collectionMarketInstance.address, { from: owner })
            await collectionTokenInstance.mintCollection()
        })

        context('Add Item', () => {
            it('should add item', async () => {
                let ownerBalance = await collectionTokenInstance.balanceOf(owner)
                expect(ownerBalance).to.bignumber.equal(new BN(tokenMetadataURIs.length))

                for (let i = 0; i < tokenMetadataURIs.length; i++) {
                    const itemId = i + 1
                    await collectionMarketInstance.addItem(collectionTokenInstance.address, itemId, price, { from: owner })

                    const item = await collectionMarketInstance.getItemById(itemId)
                    expectBN(item.itemId, itemId)
                    expectBN(item.tokenId, itemId)
                    expectBN(item.price, price)
                    expect(item.tokenContractAddress).to.equal(collectionTokenInstance.address)
                    expect(item.seller).to.equal(owner)
                    expect(item.owner).to.equal(constants.ZERO_ADDRESS)

                    ownerBalance = await collectionTokenInstance.balanceOf(owner)
                    expectBN(ownerBalance, tokenMetadataURIs.length - i - 1)

                    const contractBalance = await collectionTokenInstance.balanceOf(collectionMarketInstance.address)
                    expectBN(contractBalance, itemId)
                }
            })

            it('should emit an event adding item', async () => {
                expectEvent(
                    await collectionMarketInstance.addItem(collectionTokenInstance.address, 1, 100, { from: owner }),
                    'ItemCreated',
                    { itemId: new BN(1), tokenId: new BN(1), price: new BN(100), tokenContractAddress: collectionTokenInstance.address, seller: owner, owner: constants.ZERO_ADDRESS }
                )
            })

            it('should not add item if sender is not the owner', async () => {
                await expectRevert(
                    collectionMarketInstance.addItem(collectionTokenInstance.address, 1, price, { from: user }),
                    'Ownable: caller is not the owner.'
                )
            })

            it('should not add item if price is 0', async () => {
                await expectRevert(
                    collectionMarketInstance.addItem(collectionTokenInstance.address, 1, 0, { from: owner }),
                    'No ETH sent'
                )
            })
        })

        context('Buy Item', () => {
            beforeEach(async () => {
                for (let i = 0; i < tokenMetadataURIs.length; i++) {
                    const itemId = i + 1
                    await collectionMarketInstance.addItem(collectionTokenInstance.address, itemId, price, { from: owner })
                }
            })

            it('should buy item', async () => {
                const itemId = 1
                let item = await collectionMarketInstance.getItemById(itemId)
                expectBN(item.itemId, itemId)
                expectBN(item.tokenId, itemId)
                expect(item.seller).to.equal(owner)
                expect(item.owner).to.equal(constants.ZERO_ADDRESS)

                let contractBalance = await collectionTokenInstance.balanceOf(collectionMarketInstance.address)
                expectBN(contractBalance, tokenMetadataURIs.length)

                let buyerBalance = await collectionTokenInstance.balanceOf(buyer)
                expectBN(buyerBalance, 0)

                await collectionMarketInstance.buyItem(
                    collectionTokenInstance.address, itemId,
                    { from: buyer, value: price }
                )
                item = await collectionMarketInstance.getItemById(itemId)
                expectBN(item.itemId, itemId)
                expectBN(item.tokenId, itemId)
                expect(item.seller).to.equal(owner)
                expect(item.owner).to.equal(buyer)

                contractBalance = await collectionTokenInstance.balanceOf(collectionMarketInstance.address)
                expectBN(contractBalance, tokenMetadataURIs.length - 1)

                buyerBalance = await collectionTokenInstance.balanceOf(buyer)
                expectBN(buyerBalance, 1)
            })

            it('should not buy item if no ETH sent', async () => {
                await expectRevert(
                    collectionMarketInstance.buyItem(collectionTokenInstance.address, 1, { from: buyer }),
                    'Wrong price for this item'
                )
            })

            it('should not buy item if the price is not correct', async () => {
                await expectRevert(
                    collectionMarketInstance.buyItem(collectionTokenInstance.address, 1, { from: buyer, value: ether(new BN(0.01)) }),
                    'Wrong price for this item'
                )
            })
        })

        context('Get market items', () => {
            beforeEach(async () => {
                for (let i = 0; i < tokenMetadataURIs.length; i++) {
                    const itemId = i + 1
                    await collectionMarketInstance.addItem(collectionTokenInstance.address, itemId, price, { from: owner })
                }
            })

            it('should get buyer collection items', async () => {
                let buyerItems = await collectionMarketInstance.getSenderItems({ from: buyer })
                expectBN(new BN(buyerItems.length), 0)

                await collectionMarketInstance.buyItem(
                    collectionTokenInstance.address, 2,
                    { from: buyer, value: price }
                )
                await collectionMarketInstance.buyItem(
                    collectionTokenInstance.address, 3,
                    { from: buyer, value: price }
                )
                buyerItems = await collectionMarketInstance.getSenderItems({ from: buyer })
                expectBN(new BN(buyerItems.length), 2)
                expect(buyerItems[1].tokenId).to.equal('3')
                expect(buyerItems[1].owner).to.equal(buyer)
            })

            it('should get unsold items', async () => {
                let unsoldItems = await collectionMarketInstance.getUnsoldItems({ from: user })
                expectBN(new BN(unsoldItems.length), 3)
                expectBN(unsoldItems[0].itemId, 1)
                expectBN(unsoldItems[0].tokenId, 1)
                expectBN(unsoldItems[2].itemId, 3)
                expectBN(unsoldItems[2].tokenId, 3)

                await collectionMarketInstance.buyItem(
                    collectionTokenInstance.address, 1,
                    { from: buyer, value: price }
                )
                unsoldItems = await collectionMarketInstance.getUnsoldItems({ from: user })
                expectBN(new BN(unsoldItems.length), 2)
                expectBN(unsoldItems[0].itemId, 2)
                expectBN(unsoldItems[0].tokenId, 2)
                expectBN(unsoldItems[1].itemId, 3)
                expectBN(unsoldItems[1].tokenId, 3)
            })
        })
    })
})
