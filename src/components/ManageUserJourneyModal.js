import React, { Component } from "react";
import { Modal, Tabs, Icon } from 'antd';
import { Link } from "react-router-dom";

import { AuthUserContext } from "../common/Authentication";
import ManageInstagram from "./ManageInstagram";
import ChangePassWordForm from "./ChangePassWordForm";
import ManageJourney from "./ManageJourney";

import "./SinInOutnModal.scss";

const TabPane = Tabs.TabPane;

function onTabChange(key) {
}

class ManageUserJourneyModal extends Component {

  render() {
    const { visible, onClose } = this.props;
    return (
      <Modal
        title="Manage account"
        visible={visible}
        onOk={onClose}
        wrapClassName='modal'
        onCancel={onClose}
        footer = {null}>
        <p>
          <AuthUserContext.Consumer>
            {authUser => (
              <Link to={`/user/${authUser.uid}`}>&laquo; Back to My Map</Link>
            )}
          </AuthUserContext.Consumer>
        </p>
        <p>The settings do not yet affect the map, sorry about that!</p>
        <Tabs defaultActiveKey="1" onChange={onTabChange}>
          <TabPane tab={<span><Icon type="api" />Journey Settings</span>} key="1">
            <ManageJourney />
          </TabPane>
          <TabPane tab={<span><Icon type="api" />Account settings</span>} key="2">
            <ChangePassWordForm />
            <ManageInstagram instagram={this.props.instagram} instaHandler={this.props.instaHandler}/>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default ManageUserJourneyModal;
