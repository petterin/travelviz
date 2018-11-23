import React from "react";
import { Menu, Dropdown, Icon } from "antd";
import { Link } from "react-router-dom";

import { withFirebase } from "./Firebase";
import { AuthUserContext } from "./Authentication";
import { MODAL_KEYS } from "../components/SinInOutnModal";

import "./Navigation.scss";

const Navigation = ({ showModal, firebase }) => {
  const showSignInModal = () => showModal(MODAL_KEYS["SIGN_IN"]);
  const showSignUpModal = () => showModal(MODAL_KEYS["SIGN_UP"]);

  const guestMenu = (
    <Menu className="Navigation-Menu">
      <Menu.Item onClick={showSignUpModal}>
        <Icon type="user-add" />
        Sign up
      </Menu.Item>
      <Menu.Item>
        <Link to="/">
          <Icon type="info-circle" />
          About
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={showSignInModal}>
        <Icon type="login" />
        Log in
      </Menu.Item>
    </Menu>
  );

  const userMenu = (user, firebase) => {
    const displayName = user.displayName || user.email;
    return (
      <Menu className="Navigation-Menu">
        <Menu.Item>{displayName}</Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <Link to="/user/demo">
            <Icon type="home" />
            My Map
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/settings">
            <Icon type="setting" />
            Settings
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/">
            <Icon type="info-circle" />
            About
          </Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={firebase.doSignOut}>
          <Icon type="logout" />
          Log out
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <Dropdown
          overlay={authUser ? userMenu(authUser, firebase) : guestMenu}
          className="Navigation-Dropdown"
        >
          <Icon type="down" className="menu-icon" />
        </Dropdown>
      )}
    </AuthUserContext.Consumer>
  );
};

export default withFirebase(Navigation);
