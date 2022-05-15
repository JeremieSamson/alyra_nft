import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from "./components/TopBar";
import "./App.css";
import Collections from "./components/Collections";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Authors from "./components/Authors";
import {NotificationContainer} from "react-notifications";
import MyNFT from "./components/MyNFT";
import Nfts from "./components/Nfts";
import NewCollection from "./components/NewCollection";
import CollectionFactory from "./contracts/CollectionFactory.json";
import CollectionToken from "./contracts/CollectionToken.json";
import getWeb3 from "./getWeb3";
import CollectionMarket from "./contracts/CollectionMarket.json";

class App extends Component {
    state = {
        collectionFactoryContract: 0,
        collections: [],
        nfts: []
    };

    componentDidMount = async () => {
        try {
            const web3 = await getWeb3();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = CollectionFactory.networks[networkId];
            const collectionFactoryContract = new web3.eth.Contract(
                CollectionFactory.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const deployedNetworkMarket = CollectionMarket.networks[networkId];
            const collectionMarketContract = new web3.eth.Contract(
                CollectionMarket.abi,
                deployedNetworkMarket && deployedNetworkMarket.address,
            );

            this.setState({ collectionFactoryContract: collectionFactoryContract, collectionMarketContract: collectionMarketContract }, this.loadEvents);
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    };

    async loadEvents() {
        let collections = this.loadNFTCollectionCreatedEvents();
        await this.loadMarketEvents();

        for(let i=0 ; i<collections.length ; i++) {
            //console.log(i);
        }
    }

    loadMarketEvents() {
        let {  collectionMarketContract, collections, nfts } = this.state;
        let app = this;

        collectionMarketContract.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        }, function(error, eventsData){})
            .then(function(smartContractEvents){
                for(let smartContractEvent of smartContractEvents) {
                    console.log('marketevents', smartContractEvent);
                }
            });
    }

    loadNFTCollectionCreatedEvents() {
        let { collectionFactoryContract, collections, nfts } = this.state;
        let app = this;

        collectionFactoryContract.getPastEvents('allEvents', {
            fromBlock: 0,
            toBlock: 'latest'
        }, function(error, eventsData){})
            .then(function(smartContractEvents){
                for(let smartContractEvent of smartContractEvents) {
                    console.log(smartContractEvent.event);
                    if (smartContractEvent.event === "NFTCollectionCreated") {
                        collections.push({
                            title: smartContractEvent.returnValues[0],
                            address: smartContractEvent.returnValues[1],
                            owner: smartContractEvent.returnValues[2],
                        });
                    }
                }
            });

        app.setState({
            collections: collections,
            nfts: nfts
        });

        return collections;
    }

    async loadTokenMintedEvents(address) {
        let {  collections, nfts } = this.state;
        let app = this;
        let collectionToken = null;

        try {
            const web3 = await getWeb3();
            collectionToken = new web3.eth.Contract(
                CollectionToken.abi,
                address,
            );

            collectionToken.getPastEvents('allEvents', {
                fromBlock: 0,
                toBlock: 'latest'
            }, function(error, eventsData){})
                .then(function(smartContractEvents){
                    console.log(smartContractEvents);
                    for(let smartContractEvent of smartContractEvents) {

                        if (smartContractEvent.event === "NFTCollectionCreated") {
                            collections.push({
                                title: smartContractEvent.returnValues[0],
                                address: smartContractEvent.returnValues[1]
                            });
                        }
                    }
                });
        } catch (error) {
            console.error(error);
        }

        app.setState({
            collections: collections,
            nfts: nfts
        });
    }

  render() {
      return (
          <div className="App">
            <NotificationContainer/>
            <TopBar/>
            <BrowserRouter>
              <Routes>
                  <Route exact path='/my-nft' element={<MyNFT />}/>
                  <Route exact path='/collections' element={<Collections collections={this.state.collections}/>}/>
                  <Route path='collections'>
                      <Route exact path='new' element={<NewCollection />}/>
                      <Route path=":collectionId" element={<Nfts />}>
                          <Route path="create" element={<Nfts />}/>
                      </Route>
                  </Route>
                  <Route exact path='/team' element={<Authors />}/>
                  <Route exact path='/contact' element={<Contact />}/>

                  <Route
                      path="*"
                      element={
                          <main style={{ padding: "1rem" }}>
                              <p>There's nothing here!</p>
                          </main>
                      }
                  />
              </Routes>
            </BrowserRouter>
            <Footer />
          </div>
      );
  }
}

export default App;
