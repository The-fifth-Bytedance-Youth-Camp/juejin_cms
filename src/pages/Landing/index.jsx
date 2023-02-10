import {
	LoginFormPage,
	ProFormCheckbox,
} from '@ant-design/pro-components';
import { Drawer, message, Tabs } from 'antd';
import React, { useState } from 'react';
import logo from '../../assets/svg/logo-small.svg';
import byteDance from '../../assets/img/byteDance.png';
import Email from './Email';
import Account from './Account';
import Register from './Register';
import useScreenWidth from '../../utils/hooks/useScreenWidth';
import { personApi } from '../../apis/person';

const Landing = () => {
	const [ messageApi, contextHolder ] = message.useMessage();
	const [ open, setOpen ] = useState(false);
	const [ loginType, setLoginType ] = useState('account');
	const screenWidth = useScreenWidth();
	const closeDrawer = () => setOpen(false);
	// 登录
	const accountLogin = async ({ autoLogin, username, password }) => {
		const { data: { code, token } } = await personApi.loginByPassword(username, password);
		if (autoLogin && token) localStorage.setItem('token', token);
		await messageApi.open({
			type: code === 200 ? 'success' : 'error',
			content: code === 200 ? '登陆成功（3秒后自动登录）' : '登录失败',
			duration: 2,
		});
		location.reload();
	};
	const emailLogin = ({ autoLogin, captcha, email }) => {
		console.log(autoLogin, captcha, email);
		setTimeout(() => {
			location.reload();
		}, 1000);
	};
	return (
		<div style={ { backgroundColor: 'white', height: '100vh', overflow: 'hidden' } }>
			{ contextHolder }
			<LoginFormPage
				onFinish={
					async (e) => {
						if (loginType === 'account') {
							await accountLogin(e);
							return;
						}
						emailLogin(e);
					}
				}
				backgroundImageUrl={ byteDance }
				logo={ logo }
				style={ { backgroundPosition: '-550px center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } }
				title="稀土掘金"
				subTitle="中文开发者的技术内容交流平台">
				<Tabs centered
							activeKey={ loginType }
							items={ [
								{ label: '账号登录', key: 'account' },
								{ label: '邮箱登录', key: 'email' },
							] }
							onChange={ (activeKey) => setLoginType(activeKey) }/>
				{ loginType === 'account' && <Account/> }
				{ loginType === 'email' && <Email/> }
				<div style={ { marginBlockEnd: 24 } }>
					<ProFormCheckbox noStyle name="autoLogin">30天免登录</ProFormCheckbox>
					<a style={ { float: 'right' } }
						 onClick={ () => setOpen(true) }>立即注册</a>
				</div>
			</LoginFormPage>
			<Drawer
				title="申请管理员账号"
				width={ screenWidth < 769 ? '100vw' : null }
				onClose={ closeDrawer }
				open={ open }
				bodyStyle={ { paddingBottom: '40px' } }>
				<Register cancel={ closeDrawer }/>
			</Drawer>
		</div>
	);
};

export default Landing;
