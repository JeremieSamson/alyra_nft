import React, { Component } from 'react'
import Card from "./Card";
import getWeb3 from "../getWeb3";
import {NotificationManager} from "react-notifications";
import CollectionMarket from "../contracts/CollectionMarket.json";
import MintedNFTItem from "./MintedNFTItem";

class MyNFT extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.state = {
            query: null,
            nfts: []
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
            console.log(nfts);
            this.setState({nfts: nfts});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    handleSearch(e) {
        this.setState({query:e.target.value});
    }

    render() {
        const filteredData = this.state.nfts.filter((data) => {
            if (this.state.query === null || this.state.query === '') {
                return data;
            } else {
                return data.title.toLowerCase().includes(this.state.query.toLowerCase())
            }
        })

        if (filteredData.length === 0) {
            return (
                <>
                    <div className="container mt-5 mb-5">
                        <h1>You don't have any NFT</h1>
                    </div>
                </>
            );
        }

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
                                    itemId={item.itemId}
                                    owner={item.owner}
                                    price={item.price}
                                    seller={item.seller}
                                    tokenContractAddress={item.tokenContractAddress}
                                    tokenId={item.tokenId}
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