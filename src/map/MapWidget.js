import React, { Component } from "react";

import "./Map.css";

class MapWidget extends Component {
  render() {
    return <div className="MapWidget">{this.props.children}</div>;
  }
}

export default MapWidget;
