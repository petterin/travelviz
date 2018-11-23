import React, { Component } from "react";
import ManageUserJourneyModal from "../components/ManageUserJourneyModal";

import "./Settings.scss";
import "../frontpage/Home.scss";

class Settings extends Component {
  state = {
    instagram: false,
    visible: true
  }
  handleClick = () => {
    this.setState({
      instagram: !this.state.instagram,
    });
  }

  // TODO: Instagram token handling to explicit and based on Firebase
  render() {
    return (
      <ManageUserJourneyModal visible={this.state.visible} instagram={this.state.instagram} instaHandler={() => this.handleClick()} />
    );
  }
}

export default Settings;
