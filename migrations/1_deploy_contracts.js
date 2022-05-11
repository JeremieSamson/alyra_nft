const CollectionToken = artifacts.require('./CollectionToken.sol')
const CollectionMarket = artifacts.require('./CollectionMarket.sol')
const baseUri = 'ipfs://QmbaFspXrjbWkEuGWWWWpKp9SqYkbSQtkz7etDvxMsjDTy/'

module.exports = function (deployer) {
    deployer.deploy(CollectionMarket).then(function () {
        return deployer.deploy(CollectionToken, baseUri, CollectionMarket.address)
    })
}
