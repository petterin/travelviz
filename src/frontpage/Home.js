import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./Home.scss";

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <h1 className="Home-title">Welcome to Travel Visualization!</h1>
        <p className="Home-intro">
          Go to <Link to="/user/demo">Map view</Link>
        </p>
      </div>
    );
  }
}

export default Home;
