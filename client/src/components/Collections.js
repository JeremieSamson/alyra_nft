import React, { Component } from 'react'
import CollectionItem from "./CollectionItem";
import getWeb3 from "../getWeb3";
import CollectionMarket from "../contracts/CollectionMarket.json";

class Collections extends Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);

        this.state = {
            query: null,
            collections: []
        }
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

            //const collections = await collectionMarketContract.methods.getUnsoldItems().call({from: accounts[0]});

            const collections = [
                {
                    "itemId": 1,
                    "tokenId": 1,
                    "price": 1,
                    "tokenContractAddress": 1,
                    "seller": 1,
                    "owner": 1,
                },
                {
                    "itemId": 2,
                    "tokenId": 222,
                    "price": 42,
                    "tokenContractAddress": '0xZAEZAE',
                    "seller": '',
                    "owner": '',
                }
            ];
            this.setState({collections: collections});
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
        const filteredCollections = this.state.collections.filter((collection) => {
            if (this.state.query === null || this.state.query === '') {
                return collection;
            } else {
                return collection.title.toLowerCase().includes(this.state.query.toLowerCase())
            }
        })

        if (filteredCollections.length === 0) {
            return (
                <>
                    <div className="container mt-5 mb-5">
                        <h1>There is no collection yet</h1>
                    </div>
                </>
            );
        }

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
                            <div className="col" key={item.id}>
                                <CollectionItem imageSrc={item.imageSrc} title={item.title} owner={item.owner} id={item.id}/>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
    }
}

export default Collections;