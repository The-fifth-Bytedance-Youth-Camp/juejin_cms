import {
	CrownFilled,
	LayoutFilled,
	PieChartFilled,
	TeamOutlined,
	UserSwitchOutlined,
	PlusCircleOutlined,
	SecurityScanOutlined,
	EditOutlined,
	FormOutlined,
} from '@ant-design/icons';
import React from 'react';

import Home from '../pages/Home';
import Redirect from '../components/Redirect';
import SuperInfo from '../pages/Person/Admin';
import CommonInfo from '../pages/Person/User';
import Insert from '../pages/Post/Insert';
import Search from '../pages/Post/Search';
import Audit from '../pages/Post/Audit';
import Category from '../pages/Layout/Category';
import Header from '../pages/Layout/Header';
import Markdown from '../pages/Layout/Markdown';

const menus = [
	{
		path: '/',
		name: '数据总览',
		icon: <PieChartFilled/>,
		element: <Home/>,
	},
	{
		path: '/person',
		name: '人员管理',
		icon: <TeamOutlined/>,
		element: <Redirect to="/person/user"/>,
		routes: [
			{
				path: 'user',
				name: '用户管理',
				icon: <UserSwitchOutlined/>,
				element: <CommonInfo/>,
			},
			{
				path: 'admin',
				name: '管理员管理',
				icon: <CrownFilled/>,
				element: <SuperInfo/>,
			},
		],
	},
	{
		path: '/post',
		name: '文章管理',
		icon: <FormOutlined/>,
		element: <Redirect to="/post/insert"/>,
		routes: [
			{
				path: 'insert',
				name: '添加文章',
				icon: <PlusCircleOutlined/>,
				element: <Insert/>,
			},
			{
				path: 'search',
				name: '搜索文章',
				icon: <SecurityScanOutlined/>,
				element: <Search/>,
			},
			{
				path: 'audit',
				name: '审核文章',
				icon: <EditOutlined/>,
				element: <Audit/>,
			},
		],
	},
	{
		path: '/layout',
		name: '网页排版',
		icon: <LayoutFilled/>,
		element: <Redirect to="/layout/header"/>,
		routes: [
			{
				path: 'header',
				name: '网站头部',
				icon: <CrownFilled/>,
				element: <Header/>,
			},
			{
				path: 'category',
				name: '文章分类',
				icon: <CrownFilled/>,
				element: <Category/>,
			},
			{
				path: 'upload',
				name: '文件上传',
				icon: <CrownFilled/>,
				routes: [
					{
						path: 'theme',
						name: 'Markdown 主题',
						icon: <CrownFilled/>,
						element: <Markdown/>,
					},
					{
						path: 'code',
						name: '代码块主题',
						icon: <CrownFilled/>,
						element: <Markdown/>,
					},
				],
			},
		],
	},
];

export default menus;
