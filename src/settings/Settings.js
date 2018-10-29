import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import "./Settings.scss";
import "../frontpage/Home.scss";

class Settings extends Component {
  render() {
    return (
      <div className="Home">
        <h1 className="Home-title">Welcome to User Settings!</h1>
        <p className="Home-intro">
          Here you can manage permissions and your account
        </p>
        <h1 className="Home-title">Connect to Instagram</h1>
        <p className="Home-intro">Give permissions to use your Instagram content in your travel story.</p>
        <a href="https://api.instagram.com/oauth/authorize/?client_id=84cde46c2dbe4eed8196a400ca7d6d09&redirect_uri=http://localhost:3000/settings/&response_type=token">
          <button className="insta-button">Give Permission!</button>
        </a>
      </div>
    );
  }
}

export default Settings;
