import React, { Component } from "react";
import { Button } from 'antd';

import "./Settings.scss";
import "../frontpage/Home.scss";

class Settings extends Component {
  // TODO: Instagram token handling to explicit and based on Firebase
  render() {
    return (
      <div className="Settings">
        <h1 className="Home-title">Welcome to User Settings!</h1>
        <p className="Home-intro">
          Here you can manage permissions and your account
        </p>
        <h1 className="Home-title">Connect to Instagram</h1>
        <p className="Home-intro">Give permissions to use your Instagram content in your travel story.</p>
        <Button href="https://api.instagram.com/oauth/authorize/?client_id=84cde46c2dbe4eed8196a400ca7d6d09&redirect_uri=http://localhost:3000/settings/&response_type=token&scope=public_content" className="insta-button">Give Permission!</Button>
      </div>
    );
  }
}

export default Settings;
