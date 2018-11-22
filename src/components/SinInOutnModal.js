import React, { Component } from "react";

import { Modal, Tabs, Icon } from 'antd';
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

import "./SinInOutnModal.scss";

const TabPane = Tabs.TabPane;

export const MODAL_KEYS = {
  "SIGN_UP": "1",
  "SIGN_IN": "2"
}

class SinInOutnModal extends Component {
  constructor(props) {
    super(props);
    this.state = { activeKey: props.activeKey };
  }

  onTabChange = activeKey => {
    this.setState({ activeKey });
  }

  closeModal = () => {
    this.setState({ activeKey: null });
    this.props.onClose();
  }

  render() {
    const activeKey = this.state.activeKey || this.props.activeKey || MODAL_KEYS["SIGN_UP"];
    return (
      <Modal
        visible={this.props.visible}
        onOk={this.closeModal}
        wrapClassName='modal'
        onCancel={this.closeModal}
        footer = {null}>
        <Tabs onChange={this.onTabChange} activeKey={activeKey}>
          <TabPane tab={<span><Icon type="user-add" />Sign up</span>} key={MODAL_KEYS["SIGN_UP"]}>
            <SignUpForm closeFn={this.closeModal} />
          </TabPane>
          <TabPane tab={<span><Icon type="login" />Sign in</span>} key={MODAL_KEYS["SIGN_IN"]}>
            <SignInForm closeFn={this.closeModal} />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default SinInOutnModal;