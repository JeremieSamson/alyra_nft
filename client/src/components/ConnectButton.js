import React, { Component } from 'react'
import getWeb3 from "../getWeb3";
import {NotificationManager} from "react-notifications";

class ConnectButton extends Component {
    constructor(props) {
        super(props);
        this.handleConnectWallet = this.handleConnectWallet.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.accountChangedHandler = this.accountChangedHandler.bind(this);
        this.chainChangedHandler = this.chainChangedHandler.bind(this);
        this.state = JSON.parse(window.localStorage.getItem('accounts')) || {
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

            super.setState({accounts: accounts});
            window.localStorage.setItem('accounts', JSON.stringify({accounts}));

            NotificationManager.success('You have successfully login', '', 5000);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    accountChangedHandler(newAccount) {
        window.localStorage.setItem('accounts', JSON.stringify({newAccount}));
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
                        ? <span>Hello {this.state.accounts[0]} <a href="" onClick={this.handleLogout}>Log out</a></span>
                        : <a href="#" onClick={this.handleConnectWallet}>Sign In</a>
                }
            </>
        );
    }
}

export default ConnectButton;