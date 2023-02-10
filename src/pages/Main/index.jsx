import React, { useEffect, useState } from 'react';
import { ProCard, ProLayout } from '@ant-design/pro-components';
import { layoutConfig } from '../../config/layout';
import { GithubFilled, VideoCameraFilled, YuqueFilled } from '@ant-design/icons';
import { useNavigate, useRoutes } from 'react-router-dom';
import routes from '../../routes';
import PubSub from 'pubsub-js';
import { personApi } from '../../apis/person';
import { Modal } from 'antd';
import useScreenWidth from '../../utils/hooks/useScreenWidth';

const goto = (url) => {
	return () => open(url, '_blank');
};

const Main = () => {
	const screenWidth = useScreenWidth();
	const [ isModalOpen, setIsModalOpen ] = useState(false);
	const logout = () => {
		setIsModalOpen(false);
		localStorage.clear();
		location.reload();
	};
	const [ userInfo, setUserInfo ] = useState(null);
	const setUser = (name = '管理员', src) => {
		setUserInfo({
			name,
			src,
			title: <div onClick={ () => setIsModalOpen(true) }>{ name }</div>,
		});
	};
	// 身份验证
	useEffect(() => {
		(async () => {
			if (!userInfo) {
				const { data: { name, src } } = await personApi.loginByToken();
				setUser(name, src);
			}
		})();
	});
	// 路由跳转
	const [ pathname, setPathname ] = useState(location.pathname);
	const _navigate = useNavigate();
	const navigate = (path) => {
		setPathname(path);
		_navigate(path);
	};
	PubSub?.subscribe('navigate', (_, data) => navigate(data));
	return (
		<div style={ { height: 'calc(100vh - 55px)' } }>
			<Modal title="退出登录" open={ isModalOpen } onOk={ logout }
						 onCancel={ () => setIsModalOpen(false) }>
				<p>当前账号：{ userInfo?.name }</p>
				<p>退出登录后将清空 Token</p>
			</Modal>
			<ProLayout
				{ ...layoutConfig }
				location={ { pathname } }
				menu={ { type: 'group' } }
				avatarProps={ userInfo }
				actionsRender={ ({ isMobile }) => {
					if (isMobile) return [];
					return [
						<GithubFilled key="GithubFilled"
													onClick={ goto('https://github.com/orgs/The-fifth-Bytedance-Youth-Camp/repositories') }/>,
						<YuqueFilled key="YuqueFilled"
												 onClick={ goto('https://www.yuque.com') }/>,
						<VideoCameraFilled key="VideoCameraFilled"
															 onClick={ goto('https://www.bilibili.com') }/>,
					];
				} }
				menuFooterRender={ ({ collapsed }) => {
					if (collapsed) return undefined;
					return (
						<div style={ { textAlign: 'center', paddingBlockStart: 12 } }>
							<div>© 2023 Made with love</div>
							<div>by YouSayRight</div>
						</div>
					);
				} }
				onMenuHeaderClick={ () => navigate('/') }
				menuItemRender={
					({ itemPath, isUrl }, dom) =>
						<div onClick={
							() => {
								if (isUrl) goto(itemPath)();
								navigate(itemPath);
							}
						}>{ dom }</div>
				}>
				<ProCard style={ {
					minHeight: 'calc(100vh - 123px)',
					height: screenWidth >= 766 ? 'calc(100vh - 123px)' : 'fit-content',
					marginTop: '10px',
				} }>
					{ useRoutes(routes) }
				</ProCard>
			</ProLayout>
		</div>
	);
};

export default Main;
