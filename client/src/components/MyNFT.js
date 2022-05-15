import React, { Component } from 'react'
import getWeb3 from "../getWeb3";
import CollectionMarket from "../contracts/CollectionMarket.json";
import MintedNFTItem from "./MintedNFTItem";
import CollectionToken from "../contracts/CollectionToken.json";

class MyNFT extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            query: null,
            nfts: [],
            isLoading: true
        };
    }

    async componentDidMount() {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            const deployedNetwork = CollectionMarket.networks[networkId];
            const collectionMarketContract = new web3.eth.Contract(
                CollectionMarket.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const nfts = await collectionMarketContract.methods.getSenderItems().call({from: accounts[0]});

            for (const nft of nfts) {
                await this.loadNftExtendedData(nft, web3);
            }

            this.setState({isLoading: false});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    async loadNftExtendedData(nft, web3) {
        const nftExtended = {};

        const collection = new web3.eth.Contract(
            CollectionToken.abi,
            nft.tokenContractAddress,
        );

        nftExtended.owner = nft.owner;
        nftExtended.itemId = nft.itemId;
        nftExtended.price = nft.price;
        nftExtended.seller = nft.seller;
        nftExtended.tokenId = nft.tokenId;
        nftExtended.tokenContractAddress = nft.tokenContractAddress;

        const ipfsPath = await collection.methods.tokenURI(nft.tokenId).call();
        nftExtended.tokenUri = ipfsPath.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
        nftExtended.maxSupply = await collection.methods.maxSupply().call();

        await fetch(nftExtended.tokenUri)
            .then(response => response.json())
            .then((jsonData) => {
                nftExtended.name = jsonData.name;
                nftExtended.description = jsonData.description;
                nftExtended.image = jsonData.pinata_url;
            })
            .then((jsonData) => {
                this.state.nfts.push(nftExtended);
            })
            .catch((error) => {
                // handle your errors here
                console.error(error)
            })
    }

    handleSearch(e) {
        this.setState({query:e.target.value});
    }

    render() {
        if (this.state.isLoading === true) {
            return (
                <>
                    <div className="container mt-5 mb-5">
                        <h1>Loading ...</h1>
                    </div>
                </>
            );
        }

        const filteredData = this.state.nfts.filter((data) => {
            if (this.state.query === null || this.state.query === '') {
                return data;
            } else {
                return data.name.toLowerCase().includes(this.state.query.toLowerCase())
            }
        })

        return (
            <>
                <div className="container mt-5 mb-5">
                    <h1>Your NFT Collection</h1>
                    <div className="input-group rounded searchInput">
                        <input type="search" className="form-control rounded" placeholder="Search" aria-label="Search"
                               aria-describedby="search-addon"
                               onChange={this.handleSearch}
                        />
                        <span className="input-group-text border-0" id="search-addon">
                            <i className="fas fa-search"/>
                          </span>
                    </div>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {filteredData.map((item) => (
                            <div className="col">
                                <MintedNFTItem
                                    title={item.name}
                                    price={item.price}
                                    itemId={item.itemId}
                                    tokenId={item.tokenId}
                                    owner={item.owner}
                                    seller={item.seller}
                                    tokenContractAddress={item.tokenContractAddress}
                                    description={item.description}
                                    image={item.image}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default MyNFT;