import React, { Component } from "react";
import { Form, Button } from 'antd';
const FormItem = Form.Item;

class ManageInstagram extends Component {

  // TODO: Instagram token handling to explicit and based on Firebase
  render() {
    if (this.props.instagram) {
      return (
        <Form layout="horizontal" className="login-form">
          <FormItem>
            <Button 
              layout="horizontal"
              block
              type="primary"
              href="https://api.instagram.com/oauth/authorize/?client_id=84cde46c2dbe4eed8196a400ca7d6d09&redirect_uri=http://localhost:3000/settings/&response_type=token&scope=public_content" 
              onClick={() => {this.props.instaHandler()}}
            >
              Show my pictures on map!
            </Button>
          </FormItem>
        </Form>
      );
    }
    return (
      <Form layout="horizontal" className="login-form">
        <FormItem>
          <Button 
            layout="horizontal"
            block
            type="primary"
            onClick={() => {this.props.instaHandler()}}
          >
            Revoke Instagram permission
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default ManageInstagram;