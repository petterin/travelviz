import React, { Component } from "react";

import { Modal, Tabs, Icon } from 'antd';
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

import "./SinInOutnModal.scss";

const TabPane = Tabs.TabPane;
function onTabChange(key) {
  console.log(key);
}

class SinInOutnModal extends Component {

  render() {
    const { visible, onClose } = this.props
    return (
      <Modal
        visible={visible}
        onOk={onClose}
        wrapClassName='modal'
        onCancel={onClose}
        footer = {null}>
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab={<span><Icon type="user" />Sign in</span>} key="1">
            <SignInForm />
          </TabPane>
          <TabPane tab={<span><Icon type="user-add" />Sign up</span>} key="2">
            <SignUpForm />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default SinInOutnModal;