import React, { Component } from 'react'
import {NotificationManager} from "react-notifications";
import CollectionFactory from "../contracts/CollectionFactory.json";
import CollectionMarket from "../contracts/CollectionMarket.json";
import CollectionToken from "../contracts/CollectionToken.json";
import getWeb3 from "../getWeb3";

class NewCollection extends Component {
    constructor(props) {
        super(props);

        this.handleCreateCollection = this.handleCreateCollection.bind(this);

        this.state = {
            url: '',
            name: '',
            symbol: '',
            collectionAddress: '',
        }
    }

    async handleCreateCollection() {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            const deployedNetworkMarketPlace = CollectionMarket.networks[networkId];
            const instanceMarketPlace = new web3.eth.Contract(
                CollectionMarket.abi,
                deployedNetworkMarketPlace && deployedNetworkMarketPlace.address,
            );

            const deployedNetworkFactory = CollectionFactory.networks[networkId];
            const instanceFactory = new web3.eth.Contract(
                CollectionFactory.abi,
                deployedNetworkFactory && deployedNetworkFactory.address,
            );

            const result = await instanceFactory.methods.createNFTCollection(this.state.name, this.state.symbol, this.state.url, instanceMarketPlace.options.address).send({from: accounts[0]});
            const collectionAddress = result.events.NFTCollectionCreated.returnValues[1]

            this.setState({collectionAddress: collectionAddress});

            NotificationManager.success('Collection successfully created', '', 5000);
        }catch (error) {
            console.log(error);
        }
    }

    render() {
        return <div className="container mt-5  mb-5">
            <h1>Create your collection</h1>

            <div className="mb-3 text-start mt-5">
                <label htmlFor="inputName" className="form-label">Name</label>
                <input
                    id="inputName"
                    type="text"
                    className="form-control"
                    placeholder=""
                    onChange={(event) => this.state.name =event.target.value}
                />

                <label htmlFor="inputSymbol" className="form-label">Symbol</label>
                <input
                    id="inputSymbol"
                    type="text"
                    className="form-control"
                    placeholder=""
                    onChange={(event) => this.state.symbol = event.target.value}
                />

                <label htmlFor="inputUrl" className="form-label">Base URL (don't have one ?create it with pinata <a href="/pinata">here</a>)</label>
                <input
                    id="inputUrl"
                    type="text"
                    className="form-control"
                    placeholder="e.g. ipfs://QmfQYC1s6n77SmCSyqcXbYcJNwXQ1so9EUVUEKtWvxrhVL/"
                    onChange={(event) => this.state.url = event.target.value}
                />

                <button className="btn btn-success mt-5" onClick={this.handleCreateCollection}>Create collection</button><br/>
                { this.state.collectionAddress.length > 0 ? <a className="btn btn-success" href={`/collections/${this.state.collectionAddress}/create`}>Create your NFTs</a> : ''}
            </div>
        </div>;
    }
}

export default NewCollection;