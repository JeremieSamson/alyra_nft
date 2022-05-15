import React, {Component} from 'react'
import getWeb3 from "../getWeb3";
import {NotificationManager} from "react-notifications";
import CollectionFactory from "../contracts/CollectionFactory.json";

class ConnectButton extends Component {
    constructor(props) {
        super(props);

        this.handleConnectWallet = this.handleConnectWallet.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.accountChangedHandler = this.accountChangedHandler.bind(this);
        this.chainChangedHandler = this.chainChangedHandler.bind(this);

        const account = JSON.parse(window.localStorage.getItem('account'));
        console.log(account);
        this.state = {
            account: account !== null && account['account'] !== undefined ? account['account'] : null,
            collectionFactoryContract: null,
            collections: [],
            nfts: []
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

            // if (networkId !== 1652538770593 && networkId !== 42) {
            //     NotificationManager.error('You are on a wrong network', '', 5000);
            //
            //     return;
            // }

            const deployedNetwork = CollectionFactory.networks[networkId];
            const collectionFactoryContract = new web3.eth.Contract(
                CollectionFactory.abi,
                deployedNetwork && deployedNetwork.address,
            );

            window.localStorage.setItem('account', JSON.stringify({account: accounts[0]}));
            super.setState({account: accounts, collectionFactoryContract: collectionFactoryContract});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    accountChangedHandler(newAccount) {
        window.localStorage.setItem('account', JSON.stringify({account: newAccount}));
        this.setState({account: newAccount});
    }

    chainChangedHandler(newChainId) {
        if (newChainId !== "0x539" || newChainId !== "0x2a") {
            NotificationManager.error('This chain is not supported', '', 5000);
        }
    }

    render() {
        return (
            <>
                {
                    this.state.account>0
                        ? <span><a href="/collections/new">Create Collection</a>&nbsp;&nbsp;<a href="/my-nft">My NFTs</a>&nbsp;&nbsp;<a href="" onClick={this.handleLogout}>Log out</a></span>
                        : <a href="#" onClick={this.handleConnectWallet}>Sign In</a>
                }
            </>
        );
    }
}

export default ConnectButton;