const CollectionToken = artifacts.require('CollectionToken')
const CollectionMarket = artifacts.require('CollectionMarket')
const { expect } = require('chai')
const { BN, expectRevert, constants } = require('@openzeppelin/test-helpers')

contract('Collection token test', accounts => {
    const owner = accounts[0]
    const user = accounts[1]
    let collectionTokenInstance
    let collectionMarketInstance
    const baseUri = 'ipfs://QmbaFspXrjbWkEuGWWWWpKp9SqYkbSQtkz7etDvxMsjDTy/'
    const tokenMetadataURIs = [
        'Mojo-Jojo.json',
        'morpheus.json',
        'biggie.json'
    ]

    describe('CollectionToken', () => {
        beforeEach(async () => {
            collectionMarketInstance = await CollectionMarket.new({ from: owner })
            collectionTokenInstance = await CollectionToken.new(baseUri, collectionMarketInstance.address, { from: owner })
        })

        context('Update inital variables', () => {
            it('should set the max supply', async () => {
                let result = await collectionTokenInstance.maxSupply()
                expect(result).to.bignumber.equal(new BN(3))
                await collectionTokenInstance.setMaxSupply(10)
                result = await collectionTokenInstance.maxSupply()
                expect(result).to.bignumber.equal(new BN(10))
            })

            it('should not set the max supply if sender is not the owner', async () => {
                await expectRevert(collectionTokenInstance.setMaxSupply(10, { from: user }), 'Ownable: caller is not the owner.')
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
                    'Ownable: caller is not the owner.'
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
                    collectionTokenInstance.setBaseURI('ipfs://qwertyui/',
                        { from: user }),
                    'Ownable: caller is not the owner'
                )
            })
        })

        context('Mint NFT', () => {
            it('should mint the NFT collection', async () => {
                let result = await collectionTokenInstance.totalSupply()
                let ownerBalance = await collectionTokenInstance.balanceOf(owner)
                let approvedResult = await collectionTokenInstance.isApprovedForAll(owner, collectionMarketInstance.address)

                expect(result).to.bignumber.equal(new BN(0))
                expect(ownerBalance).to.bignumber.equal(new BN(0))
                expect(approvedResult).to.equal(false)

                await collectionTokenInstance.mintCollection()
                result = await collectionTokenInstance.totalSupply()
                ownerBalance = await collectionTokenInstance.balanceOf(owner)
                approvedResult = await collectionTokenInstance.isApprovedForAll(
                    owner,
                    collectionMarketInstance.address
                )

                expect(result).to.bignumber.equal(new BN(tokenMetadataURIs.length))
                expect(ownerBalance).to.bignumber.equal(new BN(tokenMetadataURIs.length))
                expect(approvedResult).to.equal(true)

                for (let i = 0; i < tokenMetadataURIs.length; i++) {
                    const tokenURIs = await collectionTokenInstance.tokenURI(i + 1)
                    expect(tokenURIs).to.be.equal(baseUri + tokenMetadataURIs[i])
                }
            })

            it('should not mint the collection if sender is not the owner', async () => {
                await expectRevert(collectionTokenInstance.mintCollection({ from: user }), 'Ownable: caller is not the owner')
            })
        })
    })
})
