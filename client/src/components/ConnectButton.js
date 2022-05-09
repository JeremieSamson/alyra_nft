import React, { Component } from 'react'
import getWeb3 from "../getWeb3";
import SimpleStorageContract from "../contracts/SimpleStorage.json";
import {NotificationManager} from 'react-notifications';

class ConnectButton extends Component {
    constructor(props) {
        super(props);
        this.handleConnectWallet = this.handleConnectWallet.bind(this);
        this.state = this.props.state;
    }

    async handleConnectWallet(e) {
        e.preventDefault();

        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];

            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({web3: web3, accounts: accounts, contract: instance});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    getAvatar() {
        return this.state.accounts > 0
            ? <span>Sign in</span>
            : <span>Hello {this.state.accounts[0]}</span>
        ;
    }

    render() {
        console.log(this.state.accounts);
        return (
            <>
                {
                    this.state.accounts>0
                        ? <span>Hello {this.state.accounts[0]}</span>
                        : <a href="#" onClick={this.handleConnectWallet}>Sign In</a>
                }
            </>
        );
    }
}

export default ConnectButton;