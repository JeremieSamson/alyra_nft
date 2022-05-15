const CollectionFactory = artifacts.require('./CollectionFactory.sol')
const CollectionMarket = artifacts.require('./CollectionMarket.sol')
const collectionName = 'Crypto Brothers'
const collectionSymbol = 'CP'
const baseUri = 'ipfs://QmfQYC1s6n77SmCSyqcXbYcJNwXQ1so9EUVUEKtWvxrhVL/'

module.exports = function (deployer) {
    deployer.deploy(CollectionMarket).then(function () {
        return deployer.deploy(
            CollectionFactory,
            collectionName,
            collectionSymbol,
            baseUri,
            CollectionMarket.address
        )
    })
}
