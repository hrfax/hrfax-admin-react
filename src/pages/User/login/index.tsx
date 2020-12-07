import { AlipayCircleOutlined, TaobaoCircleOutlined, WeiboCircleOutlined } from '@ant-design/icons';
import { Alert, Checkbox,Form,Input,Button } from 'antd';
import React, { useState } from 'react';
import { Link, connect, Dispatch } from 'umi';
import { StateType } from '@/models/login';
import { LoginParamsType } from '@/services/login';
import { ConnectState } from '@/models/connect';
import LoginForm from './components/Login';
import diPng from '@/assets/di.png';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginForm;
interface LoginProps {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
}

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState<string>('account');

  const handleSubmit = (values:any) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };
  // onSubmit={handleSubmit}
  return (
    <div className={styles.main}>
      <img src={diPng}/>
      <div className={styles.loginBox}>
        <div>
        <h4>汽车分期短期融资业务管理平台</h4>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={REACT_APP_ENV?{ userName: 'jgadmin1',password:'123456' }:{}}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="userName"
            rules={[{ required: true, message: '请输入账号' }]}
          >
            <Input prefix={<UserOutlined className={styles.icon} />} placeholder="请输入账号" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined className={styles.icon} />}
              type="password"
              placeholder="请输入密码"
              
            />
          </Form.Item>
          <Form.Item style={{textAlign:"right"}}>
              

              {/* <a className={styles.forgot} href="">
                忘记密码？
              </a> */}
            </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.button}>
              登录
            </Button>
            
          </Form.Item>
        </Form>
        </div>
      </div>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
