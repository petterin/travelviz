import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from 'antd';
import FitText from '@kennethormandy/react-fittext';

import "./Home.scss";

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <FitText compressor={2} minFontSize={24} maxFontSize={46}>
          <React.Fragment>
            <h2>Welcome to <br/>Travel Visualization!</h2>
            <h6>Lorem ipsum tatatatt</h6>
          </React.Fragment>
        </FitText>
        <Button type="primary" size="large" href="/user/demo">Check jorney map</Button>
      </div>
    );
  }
}

export default Home;
