import React, { Component } from 'react'
import getWeb3 from "../getWeb3";
import {NotificationManager} from "react-notifications";
import CollectionMarket from "../contracts/CollectionMarket.json";

class UnsoldNFTItem extends Component {
    constructor(props) {
        super(props);
        this.handleBuy = this.handleBuy.bind(this);
    }

    async handleBuy() {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();

            const deployedNetwork = CollectionMarket.networks[networkId];
            const collectionMarketContract = new web3.eth.Contract(
                CollectionMarket.abi,
                deployedNetwork && deployedNetwork.address,
            );

            await collectionMarketContract.methods.buyItem(this.props.tokenContractAddress, this.props.itemId).send({
                from: accounts[0],
                value: this.props.price
            });

            NotificationManager.success('NFT Bought', '', 5000);

            this.setState({})
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <>
                <div className="card">
                    <img src={this.props.image} className="card-img-top" alt={this.props.title}/>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.title} ({this.props.price} wei)</h5>
                        <p className="card-text">{this.props.description}</p>

                        <button className="btn btn-success" onClick={this.handleBuy}>Buy</button>
                    </div>
                </div>
            </>
        );
    }
}

export default UnsoldNFTItem