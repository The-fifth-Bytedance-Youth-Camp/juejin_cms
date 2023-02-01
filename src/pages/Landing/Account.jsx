import React, { Fragment } from 'react';
import { ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

const Account = () => {
	return (
		<Fragment>
			<ProFormText
				autoComplete="off"
				name="username"
				fieldProps={ {
					size: 'large',
					prefix: <UserOutlined/>,
				} }
				placeholder={ ' 请输入管理员ID' }
				rules={ [
					{
						required: true,
						message: '请输入管理员ID',
					},
				] }
			/>
			<ProFormText.Password
				autoComplete="off"
				name="password"
				fieldProps={ {
					size: 'large',
					prefix: <LockOutlined className={ 'prefixIcon' }/>,
				} }
				placeholder={ ' 请输入密码' }
				rules={ [
					{
						required: true,
						message: '请输入密码',
					},
				] }
			/>
		</Fragment>
	);
};

export default Account;
