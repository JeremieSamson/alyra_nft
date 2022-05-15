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

            this.setState({ collectionFactoryContract: collectionFactoryContract, collectionMarketContract: collectionMarketContract });
        } catch (error) {
            alert(`Failed to load web3, accounts, or contract. Check console for details.`,);
            console.error(error);
        }
    };

  render() {
      return (
          <div className="App">
            <NotificationContainer/>
            <TopBar/>
            <BrowserRouter>
              <Routes>
                  <Route exact path='/my-nft' element={<MyNFT />}/>
                  <Route exact path='/' element={<Collections />}/>
                  <Route exact path='/collections' element={<Collections />}/>
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
