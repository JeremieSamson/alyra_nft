const CollectionToken = artifacts.require('CollectionToken')
const CollectionFactory = artifacts.require('CollectionFactory')
const CollectionMarket = artifacts.require('CollectionMarket')
const { expect } = require('chai')
const { BN, expectRevert, constants } = require('@openzeppelin/test-helpers')

contract('Collection token test', accounts => {
    const owner = accounts[0]
    const user = accounts[1]
    let collectionTokenInstance
    let collectionMarketInstance
    const baseUri = 'ipfs://QmfQYC1s6n77SmCSyqcXbYcJNwXQ1so9EUVUEKtWvxrhVL/'
    const tokenMetadataURIs = [
        'mojo-jojo.json',
        'morpheus.json',
        'biggie.json'
    ]

    expectBN = (number1, number2) => expect(number1).to.bignumber.equal(new BN(number2))

    describe('CollectionToken', () => {
        beforeEach(async () => {
            collectionMarketInstance = await CollectionMarket.new({ from: owner })
            collectionFactoryInstance = await CollectionFactory.new({ from: owner })
            const tx = await collectionFactoryInstance.createNFTCollection(
                'Crypto Brothers',
                'CP',
                baseUri,
                collectionMarketInstance.address, { from: owner }
            )
            collectionAddress = tx.logs[0].args[1]
            collectionTokenInstance = await CollectionToken.at(collectionAddress)
        })

        context('Update inital variables', () => {
            it('should set the max supply', async () => {
                let result = await collectionTokenInstance.maxSupply()
                expectBN(result, 3)
                await collectionTokenInstance.setMaxSupply(10, { from: owner })
                result = await collectionTokenInstance.maxSupply()
                expectBN(result, 10)
            })

            it('should not set the max supply if sender is not the owner', async () => {
                await expectRevert(collectionTokenInstance.setMaxSupply(10, { from: user }), 'Not owner')
            })

            it('should set the market contract address', async () => {
                let result = await collectionTokenInstance.marketContractAddress()
                expect(result).to.equal(collectionMarketInstance.address)
                await collectionTokenInstance.setMarketContractAddress(collectionTokenInstance.address)
                result = await collectionTokenInstance.marketContractAddress()
                expect(result).to.equal(collectionTokenInstance.address)
            })

            it('should not set the market contract address if sender is not the owner', async () => {
                await expectRevert(
                    collectionTokenInstance.setMarketContractAddress(collectionTokenInstance.address,
                        { from: user }),
                    'Not owner'
                )
            })

            it('should not set the market contract address if the contract address is invalid', async () => {
                await expectRevert(collectionTokenInstance.setMarketContractAddress(constants.ZERO_ADDRESS, { from: owner }), 'Address not valid.')
            })

            it('should set the new base URI', async () => {
                let result = await collectionTokenInstance.getBaseURI()
                expect(result).to.equal(baseUri)
                const newBaseUri = 'ipfs://qwertyui/'
                await collectionTokenInstance.setBaseURI(newBaseUri)
                result = await collectionTokenInstance.getBaseURI()
                expect(result).to.equal(newBaseUri)
            })

            it('should not set the new base URI if sender is not the owner', async () => {
                await expectRevert(
                    collectionTokenInstance.setBaseURI('ipfs://qwertyui/', { from: user }),
                    'Not owner'
                )
            })
        })

        context('Mint NFT', () => {
            it('should mint the NFT collection', async () => {
                let result = await collectionTokenInstance.totalSupply()
                let ownerBalance = await collectionTokenInstance.balanceOf(owner)
                let approvedResult = await collectionTokenInstance.isApprovedForAll(owner, collectionMarketInstance.address)

                expectBN(result, 0)
                expectBN(ownerBalance, 0)
                expect(approvedResult).to.equal(false)

                await collectionTokenInstance.mintCollection(tokenMetadataURIs)
                result = await collectionTokenInstance.totalSupply()
                ownerBalance = await collectionTokenInstance.balanceOf(owner)
                approvedResult = await collectionTokenInstance.isApprovedForAll(
                    owner,
                    collectionMarketInstance.address
                )

                expectBN(result, tokenMetadataURIs.length)
                expectBN(ownerBalance, tokenMetadataURIs.length)
                expect(approvedResult).to.equal(true)

                for (let i = 0; i < tokenMetadataURIs.length; i++) {
                    const tokenURIs = await collectionTokenInstance.tokenURI(i + 1)
                    expect(tokenURIs).to.be.equal(baseUri + tokenMetadataURIs[i])
                }
            })

            it('should not mint the collection if sender is not the owner', async () => {
                await expectRevert(collectionTokenInstance.mintCollection(tokenMetadataURIs, { from: user }), 'Not owner')
            })

            it('should not mint more than the supply', async () => {
                const maxSupply = await collectionTokenInstance.maxSupply()
                expectBN(maxSupply, tokenMetadataURIs.length)

                await collectionTokenInstance.mintCollection(tokenMetadataURIs)
                await expectRevert(collectionTokenInstance.mintCollection(tokenMetadataURIs, { from: owner }), 'Unable to mint more items')
            })
        })
    })
})
