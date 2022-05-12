const CollectionToken = artifacts.require('./CollectionToken.sol')
const CollectionMarket = artifacts.require('./CollectionMarket.sol')
const baseUri = 'ipfs://QmfQYC1s6n77SmCSyqcXbYcJNwXQ1so9EUVUEKtWvxrhVL/'

module.exports = function (deployer) {
    deployer.deploy(CollectionMarket).then(function () {
        return deployer.deploy(CollectionToken, baseUri, CollectionMarket.address)
    })
}
