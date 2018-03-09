import React from 'react';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { Stonewall } from '../../components/Stonewall';
import { graphql, ChildProps } from 'react-apollo';
import { css } from 'react-emotion';
import LoginMutationQuery from './LoginMutation.graphql';
import { LoginMutation } from '../../generatedSchemaTypes';
import { setToken } from '../../utils/auth';

const FormItem = Form.Item;

interface OwnProps extends FormComponentProps {
}

type IProps = ChildProps<OwnProps, LoginMutation>

const loginForgotStyle = css`
  float: right;
`;

const loginButtonStyle = css`
  width: 100%;
`;

class NormalLoginForm extends React.Component<IProps> {
  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.mutate && this.props.mutate({
          variables: values
        }).then(res => {
          if (res.data.login && res.data.login.token) {
            setToken(res.data.login.token);
          }
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Stonewall>
        <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
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
            <a className={loginForgotStyle} href="">Forgot password</a>
            <Button type="primary" htmlType="submit" className={loginButtonStyle}>
            Log in
          </Button>
          Or <a href="">register now!</a>
        </FormItem>
      </Form>
      </Stonewall>
    );
  }
}

export const Login = graphql<LoginMutation>(LoginMutationQuery)(Form.create()(NormalLoginForm));
