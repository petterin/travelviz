import React, { Component } from "react";
import { Button } from 'antd';
import FitText from '@kennethormandy/react-fittext';
import SignModal from "../components/SinInOutnModal"

import "./Home.scss";

class Home extends Component {
  state = {
    current: 'mail',
    visible: false
  }

  handleClick = (e) => {
    console.log('click ', e);
    this.setState({
      current: e.key,
    });
  }

  toggleModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  }

  render() {
    return (
      <div className="Home">
        <FitText compressor={2} minFontSize={24} maxFontSize={46}>
          <React.Fragment>
            <h2>Welcome to <br/>Travel Visualization!</h2>
            <h6>Lorem ipsum tatatatt</h6>
          </React.Fragment>
        </FitText>
        <Button type="primary" size="large" href="/user/demo">Demo</Button>
        <Button size="large" ghost onClick={this.toggleModal}>
          Login
        </Button>
        <SignModal visible={this.state.visible} onClose={() => this.setState({ visible: false })} />
      </div>
    );
  }
}

export default Home;
