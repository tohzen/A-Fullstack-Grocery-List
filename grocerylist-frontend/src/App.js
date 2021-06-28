
import React, { Component } from "react";

import Header from "./components/header/header";

import Grocery from "./components/grocery/grocery";

export class App extends Component {
  render() {
    return (
      <div>
        <Header />
        <Grocery />
      </div>
    );
  }
}

export default App;