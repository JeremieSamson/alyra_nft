import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import TopBar from "./components/TopBar";

import "./App.css";
import Explorer from "./components/Explorer";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Authors from "./components/Authors";
import {NotificationContainer} from "react-notifications";

class App extends Component {
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



  render() {
      return (
          <div className="App">
                <NotificationContainer/>
                <TopBar/>
                <BrowserRouter>
                  <Routes>
                      <Route exact path='/home' element={<Home />}/>
                      <Route exact path='/explore' element={<Explorer />}/>
                      <Route exact path='/team' element={<Authors />}/>
                      <Route exact path='/contact' element={<Contact />}/>
                  </Routes>
                </BrowserRouter>
                <Footer />
          </div>
      );
  }
}

export default App;
