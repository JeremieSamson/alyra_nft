import React, { Component } from 'react'
import nfts from "../data/nfts.json"
import NFTItem from "./NFTItem";
import getWeb3 from "../getWeb3";
import CollectionToken from "../contracts/CollectionToken.json";
import { create } from 'ipfs-http-client';
import {NotificationManager} from "react-notifications";
import CollectionMarket from "../contracts/CollectionMarket.json";

class Nfts extends Component {
    constructor(props) {
        super(props);

        this.handleMintAll = this.handleMintAll.bind(this);
        this.handleAddToMarket = this.handleAddToMarket.bind(this);

        this.state = {
            minted: false,
            added: false,
            address: null
        }
    }

    async handleAddToMarket() {
        try {
            const web3 = await getWeb3();
            const networkId = await web3.eth.net.getId();
            const accounts = await web3.eth.getAccounts();

            const deployedNetwork = CollectionMarket.networks[networkId];
            const collectionMarketContract = new web3.eth.Contract(
                CollectionMarket.abi,
                deployedNetwork && deployedNetwork.address,
            );

            /*for (let i=1 ; i<=this.state.maxSupply ; i++) {
                await collectionMarketContract.methods.addItem(this.state.address, 1, 1000000).send({from: accounts[0]});
            }*/
            await collectionMarketContract.methods.addItem(this.state.address, 1, 1000000).send({from: accounts[0]});
            await collectionMarketContract.methods.addItem(this.state.address, 2, 1000000).send({from: accounts[0]});
            await collectionMarketContract.methods.addItem(this.state.address, 3, 1000000).send({from: accounts[0]});


            NotificationManager.success('Collection added to the marketplace', '', 5000);

            this.setState({added: true});
        } catch (error) {
            console.log(error);
        }
    }

    async handleMintAll() {
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

            const baseUri = await collection.methods.getBaseURI().call({from: accounts[0]});
            const maxSupply = await collection.methods.maxSupply().call({from: accounts[0]});
            const ipfsPath = baseUri.replace('ipfs://', '');

            const links = []
            const url = 'https://dweb.link/api/v0'
            const ipfs = create({ url })

            // const links = []
            for await (const link of ipfs.ls(ipfsPath)) {
                links.push(link.name)
            }

            await collection.methods.mintCollection(links).send({from: accounts[0]});

            NotificationManager.success('Collection Minted', '', 5000);

            this.setState({minted: true, address: address, maxSupply: maxSupply});
        } catch (error) {
            console.log(error);
        }
    }

    render() {

        return (
            <>
                <div className="container mt-5 mb-5">
                    <h1>My NFTs</h1>
                    <div className="row row-cols-1 row-cols-md-3 g-4">
                        {this.state.minted === false ? <button className="btn btn-success" onClick={this.handleMintAll}>Mint All</button> : <button className="btn btn-success" onClick={this.handleAddToMarket}>Add to marketplace</button>}
                    </div>
                </div>
            </>
        );
    }
}

export default Nfts;