import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class ChangePassWordForm extends Component {
  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const oldPasswordError = isFieldTouched('oldPassword') && getFieldError('oldPassword');
    const newPasswordError = isFieldTouched('newPassword') && getFieldError('newPassword');
    return (
      <Form layout="horizontal" className="login-form">
        <FormItem
          validateStatus={oldPasswordError ? 'error' : ''}
          help={oldPasswordError || ''}>
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: 'Please input your old password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Old Password" />
          )}
        </FormItem>
        <FormItem
          validateStatus={newPasswordError ? 'error' : ''}
          help={newPasswordError || ''}>
          {getFieldDecorator('newPassword', {
            rules: [{ required: true, message: 'Please input your new password!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="New Password" />
          )}
        </FormItem>
        <FormItem>
          <Button
            block
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}>
            Change Password
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedChangePasswordForm = Form.create()(ChangePassWordForm)
export default WrappedChangePasswordForm