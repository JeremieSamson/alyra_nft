const HDWalletProvider = require('@truffle/hdwallet-provider')
const path = require('path')
require('dotenv').config()

module.exports = {
    contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
    networks: {
        development: {
            host: '127.0.0.1',
            port: 8545,
            network_id: '*'
        },
        docker: {
            host: 'ganache',
            port: 8545,
            network_id: '*',
            verbose: false
        },
        kovan: {
            provider: function () {
                return new HDWalletProvider({
                    mnemonic: { phrase: `${process.env.MNEMONIC}` },
                    providerOrUrl: `https://kovan.infura.io/v3/${process.env.INFURA_ID}`
                })
            },
            network_id: 42
        },
        ropsten: {
            provider: () => new HDWalletProvider(`${process.env.MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`),
            network_id: 3
        }
    },
    mocha: {
        reporter: 'eth-gas-reporter'
    },
    compilers: {
        solc: {
            version: '0.8.13',
            docker: false,
            settings: {
                optimizer: {
                    enabled: false,
                    runs: 200
                },
                evmVersion: 'byzantium'
            }
        }
    },
    plugins: ['solidity-coverage']
}
