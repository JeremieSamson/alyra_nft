import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import TopBar from "./components/TopBar";
import "./App.css";
import Collections from "./components/Collections";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Authors from "./components/Authors";
import {NotificationContainer} from "react-notifications";
import MyNFT from "./components/MyNFT";
import Nfts from "./components/Nfts";
import {CurrentAccountContext} from "./components/CurrentAccountContext";
import NewCollection from "./components/NewCollection";
import PinataUpload from "./components/PinataUpload";
import MyCollections from "./components/MyCollections";

class App extends Component {
    
  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  render() {
      return (
          <div className="App">
              <CurrentAccountContext.Provider value="">
                <NotificationContainer/>
                <TopBar/>
                <BrowserRouter>
                  <Routes>
                      <Route exact path='/' element={<Home />}/>
                      <Route exact path='/my-nft' element={<MyNFT />}/>
                      <Route path='collections'>
                          <Route exact path='new' element={<NewCollection />}/>
                          <Route exact path="mint" element={<MyCollections />}/>
                          <Route path=":collectionId" element={<Nfts />}>
                              <Route path="create" element={<Nfts />}/>
                          </Route>
                      </Route>
                      <Route exact path='/team' element={<Authors />}/>
                      <Route exact path='/contact' element={<Contact />}/>
                      <Route exact path='/pinata' element={<PinataUpload />}/>


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
              </CurrentAccountContext.Provider>
          </div>
      );
  }
}

export default App;
