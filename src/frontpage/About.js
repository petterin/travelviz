import React, { Component } from "react";
import { Button, Tabs, Row, Col, Avatar } from "antd";
import { Link } from "react-router-dom";
import FitText from "@kennethormandy/react-fittext";

import { withFirebase } from "../common/Firebase";
import { AuthUserContext } from "../common/Authentication";
import SignModal, { MODAL_KEYS } from "../components/SinInOutnModal";

import "./Home.scss";

const TabPane = Tabs.TabPane;

class About extends Component {
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
        <FitText compressor={2} minFontSize={20} maxFontSize={46}>
          <React.Fragment>
            <h2>
              About Putnik
            </h2>
          </React.Fragment>
        </FitText>
        <div class="about-content">
            <Tabs defaultActiveKey="1">
                <TabPane tab="Team" key="1">
                    <div>
                    <Row>
                        <Col span={6}><Avatar size="large" icon="user" /></Col>
                        <Col span={6}><Avatar size="large" icon="user" /></Col>
                        <Col span={6}><Avatar size="large" icon="user" /></Col>
                    </Row>
                    <Row>
                        <Col span={6}>Olga the Visualista</Col>
                        <Col span={6}>Petteri the Tech-magos</Col>
                        <Col span={6}> Jere the Yes-man</Col>
                    </Row>
                    </div>
                    <p className="about-text">
                    We are a team of three students from Aalto University having inspiring friends, who travel. Our aim is to provide simple and dynamic way of telling the journey of your travels in the world 
                    </p>
                    <p className="about-text">
                    Putnik as a name for the service comes from the Russian word Sputnik, traveler.
                    </p>
                </TabPane>
                <TabPane tab="Terms" key="2">
                    <p className="about-text">
                        By using our service, you provide access to the locations, you have visited for the viewers of our service. Our service is not tracking you in the real time and only locations, you 
                        publish, will be available to other users of our service. It is possible for you to add permission to show data from your instagram feed, which is fully optional. This service is not in any relation to instagram
                        or the owners of related businesses and we are using instagram following their guidelines for showing instagram content outside instagram.
                        <br /> <br />
                        If you participate in the discussions on the service, you are responsible for the content you are creating. If you provide content deemed inappropriate or illegal, it can be removed
                        by us and if need be, it will be delivered for authorities.
                        <br /> <br />
                        By contacting the team through the front page, you can request all data, we have about you and we will provide it within 30 days. Also through the same form, it is possible to request us to 
                        delete data related to you.
                        <br /> <br />
                        At the moment, in concept phase service is available for free, but possible pricing decisions will be communicated well ahead and using now the free version does not commit you to usage, if pricing changes.
                    </p>
                </TabPane>
            </Tabs>
        </div>
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
        <a href="mailto:putnikjourney@gmail.com" className="feedback">Give Feedback</a>
        <SignModal
          visible={this.state.visible}
          activeKey={this.state.modalKey}
          onClose={() => this.setState({ visible: false })}
        />
      </div>
    );
  }
}

export default About;