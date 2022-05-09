import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import TopBar from "./components/TopBar";

import "./App.css";
import Explorer from "./components/Explorer";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Authors from "./components/Authors";
import NotificationContainer from "react-notifications/lib/NotificationContainer";
import {NotificationManager} from "react-notifications";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
      window.addEventListener("load", async () => {
          if (window.ethereum) {
              window.ethereum.on('accountsChanged', this.accountChangedHandler);
              window.ethereum.on('chainChanged', this.chainChangedHandler);
          }
      });
  };

  runExample = async () => {
    // const { accounts, contract } = this.state;
    //
    // // Stores a given value, 5 by default.
    // await contract.methods.set(5).send({ from: accounts[0] });
    //
    // // Get the value from the contract to prove it worked.
    // const response = await contract.methods.get().call();
    //
    // // Update state with the result.
    // this.setState({ storageValue: response });
  };

    accountChangedHandler(newAccount) {
        this.setState({accounts: newAccount});
    }

    chainChangedHandler(newChainId) {
        if (newChainId !== "0x539") {
            NotificationManager.error('This chain is not supported', '', 5000);
        }
    }

  render() {
      return (
          <div className="App">
              <NotificationContainer/>
              <TopBar state={this.state}/>
              <BrowserRouter>
                  <Routes>
                      <Route exact path='/home' element={<Home state={this.state}/>}/>
                      <Route exact path='/explore' element={<Explorer state={this.state}/>}/>
                      <Route exact path='/team' element={<Authors state={this.state}/>}/>
                      <Route exact path='/contact' element={<Contact state={this.state}/>}/>
                  </Routes>
              </BrowserRouter>
              <Footer />
          </div>
      );
  }
}

export default App;
