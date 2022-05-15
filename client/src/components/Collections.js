import React, { Component } from 'react'
import CollectionItem from "./CollectionItem";
import getWeb3 from "../getWeb3";
import CollectionMarket from "../contracts/CollectionMarket.json";
import NFTItem from "./NFTItem";
import UnsoldNFTItem from "./UnsoldNftItem";

class Collections extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            query: null,
            nfts: null,
        }
    }

    async componentDidMount() {
        try {
            const web3 = await getWeb3();
            const networkId = await web3.eth.net.getId();

            const deployedNetwork = CollectionMarket.networks[networkId];
            const collectionMarketContract = new web3.eth.Contract(
                CollectionMarket.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const nfts = await collectionMarketContract.methods.getUnsoldItems().call();
            this.setState({nfts: nfts});
        } catch (error) {
            console.error(error);
        }
    };

    handleSearch(e) {
        this.setState({query:e.target.value});
    }

    render() {
        if (!Array.isArray(this.state.nfts)) {
            return (
                <>
                    <div className="container mt-5 mb-5">
                        <h1>There is no collection yet</h1>
                    </div>
                </>
            );
        }

        const filteredCollections = this.state.nfts.filter((collection) => {
            if (this.state.query === null || this.state.query === '') {
                return collection;
            } else {
                return collection.title.toLowerCase().includes(this.state.query.toLowerCase())
            }
        })

        return (
            <>
                <div className="container mt-5 mb-5">
                    <h1>Explore collections</h1>
                    <div className="input-group rounded searchInput">
                        <input type="search" className="form-control rounded" placeholder="Search a collection ..." aria-label="Search"
                               aria-describedby="search-addon"
                               onChange={this.handleSearch}
                        />
                        <span className="input-group-text border-0" id="search-addon">
                            <i className="fas fa-search"/>
                          </span>
                    </div>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {filteredCollections.map((item) => (
                            <div className="col" key={item.itemId}>
                                <UnsoldNFTItem title={item.tokenContractAddress} price={item.price} itemId={item.itemId} tokenContractAddress={item.tokenContractAddress}/>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default Collections;