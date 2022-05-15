import React, { Component } from 'react'
import getWeb3 from "../getWeb3";
import CollectionToken from "../contracts/CollectionToken.json";
import {NotificationManager} from "react-notifications";
import {useSearchParams} from "react-router-dom";
import CollectionFactory from "../contracts/CollectionFactory.json";

class NFTItem extends Component {
    constructor(props) {
        super(props);

        this.handleMint = this.handleMint.bind(this);
    }

    async handleMint () {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();

            // @ToDo find a better way to do it
            let pathname = window.location.pathname;
            const address = pathname.replace('/collections/', '').replace('/create', '')

            const collection = new web3.eth.Contract(
                CollectionToken.abi,
                address,
            );
            const baseUri = await collection.methods.mintCollection([this.props.path]).send({from: accounts[0]});
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        const ipfsLoadImageURI = "https://ipfs.io/ipfs/";
        const ipfsMetadataURI = "ipfs://";
        const itemTokenURISliced = this.props.imageSrc.slice(ipfsMetadataURI.length);
        const imageSrc = ipfsLoadImageURI + itemTokenURISliced;
        return (
            <>
                <div className="card">
                    <img src={imageSrc} className="card-img-top" alt={this.props.title}/>
                    <div className="card-body">
                        <h5 className="card-title">{this.props.title}</h5>
                        <p className="card-text">{this.props.description}</p>

                        <button className="btn btn-success" onClick={this.handleMint}>Mint</button>
                    </div>
                </div>
            </>
        );
    }
}

export default NFTItem