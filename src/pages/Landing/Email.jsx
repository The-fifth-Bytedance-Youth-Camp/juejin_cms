import React, { Fragment } from 'react';
import { ProFormCaptcha, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';

const Email = () => {
	return (
		<Fragment>
			<ProFormText
				autoComplete="off"
				fieldProps={ {
					size: 'large',
					prefix: <UserOutlined/>,
				} }
				name="email"
				placeholder={ ' Email账号' }
				rules={ [
					{
						required: true,
						message: '请输入email',
					},
					{
						pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
						message: 'email格式错误',
					},
				] }
			/>
			<ProFormCaptcha
				autoComplete="off"
				fieldProps={ {
					size: 'large',
					prefix: <LockOutlined className={ 'prefixIcon' }/>,
				} }
				captchaProps={ { size: 'large' } }
				placeholder={ ' 请输入验证码' }
				captchaTextRender={ (timing, count) => {
					if (timing) return `${ count } 获取验证码`;
					return '获取验证码';
				} }
				name="captcha"
				rules={ [
					{
						required: true,
						message: '请输入验证码！',
					},
				] }
				onGetCaptcha={ async () => {
					message.success('获取验证码成功！验证码为：1234');
				} }
			/>
		</Fragment>
	);
};

export default Email;
