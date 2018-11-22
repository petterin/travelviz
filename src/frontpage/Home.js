import React, { Component } from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import FitText from "@kennethormandy/react-fittext";

import { withFirebase } from "../common/Firebase";
import { AuthUserContext } from "../common/Authentication";
import SignModal, { MODAL_KEYS } from "../components/SinInOutnModal";

import "./Home.scss";

class Home extends Component {
  state = {
    modalKey: null,
    visible: false
  };

  showModal = key => {
    this.setState({
      modalKey: key,
      visible: true
    });
  };

  showSignupForm = () => this.showModal(MODAL_KEYS["SIGN_UP"]);
  showLoginForm = () => this.showModal(MODAL_KEYS["SIGN_IN"]);

  render() {
    // TODO: Move logout button to main navigation
    const LogoutButton = withFirebase(({ firebase }) => (
      <Button size="large" ghost onClick={firebase.doSignOut}>
        Log out
      </Button>
    ));
    const LoginButton = () => (
      <Button size="large" ghost onClick={this.showLoginForm}>
        Login
      </Button>
    );

    return (
      <div className="Home">
        <FitText compressor={2} minFontSize={24} maxFontSize={46}>
          <React.Fragment>
            <h2>
              Welcome to Putnik!
            </h2>
            <h6>Share your journey with the people, <br />who matter you the most!</h6>
          </React.Fragment>
        </FitText>
        <Link
          to="/user/demo"
          className="ant-btn ant-btn-background-ghost ant-btn-lg"
        >
          Demo map
        </Link>
        <Button type="primary" size="large" onClick={this.showSignupForm}>
          Register
        </Button>
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <LogoutButton /> : <LoginButton />)}
        </AuthUserContext.Consumer>
        <SignModal
          visible={this.state.visible}
          activeKey={this.state.modalKey}
          onClose={() => this.setState({ visible: false })}
        />
      </div>
    );
  }
}

export default Home;
