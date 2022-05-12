import React, {Component, useState} from 'react'
import getWeb3 from "../getWeb3";
import {NotificationManager} from "react-notifications";
import Contract from "../contracts/SimpleStorage.json";

class ConnectButton extends Component {
    constructor(props) {
        super(props);
        this.handleConnectWallet = this.handleConnectWallet.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.accountChangedHandler = this.accountChangedHandler.bind(this);
        this.chainChangedHandler = this.chainChangedHandler.bind(this);
        this.state = JSON.parse(window.localStorage.getItem('state')) || {
            accounts: null,
        }
    }

    componentDidMount = async () => {
        window.addEventListener("load", async () => {
            if (window.ethereum) {
                window.ethereum.on('accountsChanged', this.accountChangedHandler);
                window.ethereum.on('chainChanged', this.chainChangedHandler);
            }
        });
    };

    handleLogout() {
        window.localStorage.clear();
        this.setState({accounts: null});
        NotificationManager.success('You have successfully logout', '', 5000);
    }

    async handleConnectWallet(e) {
        e.preventDefault();

        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = Contract.networks[networkId];
            const contract = new web3.eth.Contract(
                Contract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            super.setState({accounts: accounts, contract: contract});
            window.localStorage.setItem('state', JSON.stringify({accounts: accounts, contract: contract}));
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    accountChangedHandler(newAccount) {
        window.localStorage.setItem('state', JSON.stringify({newAccount}));
        this.setState({accounts: newAccount});
    }

    chainChangedHandler(newChainId) {
        console.log(newChainId);
        if (newChainId !== "0x539") {
            NotificationManager.error('This chain is not supported', '', 5000);
        }
    }

    render() {
        return (
            <>
                {
                    this.state.accounts>0
                        ? <span><a href="/my-nft">My NFTs</a>&nbsp;&nbsp;<a href="" onClick={this.handleLogout}>Log out</a></span>
                        : <a href="#" onClick={this.handleConnectWallet}>Sign In</a>
                }
            </>
        );
    }
}

export default ConnectButton;