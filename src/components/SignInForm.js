import React, { Component } from "react";
import { Alert, Button, Checkbox, Form, Icon, Input } from 'antd';
import { withRouter } from 'react-router-dom';

import { withFirebase } from '../common/Firebase';

const FormItem = Form.Item;

const INITIAL_STATE = { error: null };

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    // To prevent submitting an empty form at the beginning.
    this.props.form.validateFields();
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { userName, password } = values;
        this.props.firebase
          .doSignInWithEmailAndPassword(userName, password)
          .then(() => {
            this.setState({ ...INITIAL_STATE });
            this.props.form.resetFields();
            this.props.closeFn();
          })
          .catch(error => {
            this.setState({ error });
          });
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    const generalError = this.state.error ? <Alert message={this.state.error.message} type="error" showIcon /> : null;
    // Only show error after a field is touched.
    const userNameError = isFieldTouched('userName') && getFieldError('userName');
    const passwordError = isFieldTouched('password') && getFieldError('password');
    return (
      <Form layout="horizontal" className="login-form" onSubmit={this.onSubmit}>
        <FormItem>{generalError}</FormItem>
        <FormItem
          validateStatus={userNameError ? 'error' : ''}
          help={userNameError || ''}>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: 'Please input your email address!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
          )}
        </FormItem>
        <FormItem
          validateStatus={passwordError ? 'error' : ''}
          help={passwordError || ''}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
        </FormItem>
        <FormItem>
          <Button
            block
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}>
            Log in
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedSignInForm = withRouter(withFirebase(Form.create()(SignInForm)));
export default WrappedSignInForm