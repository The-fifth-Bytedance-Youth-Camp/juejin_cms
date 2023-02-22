import {
	CrownFilled,
	LayoutFilled,
	PieChartFilled,
	TeamOutlined,
	UserOutlined,
	SafetyOutlined,
	InfoCircleOutlined,
	UserSwitchOutlined,
	PlusCircleOutlined,
	SecurityScanOutlined,
	EditOutlined,
	FormOutlined,
} from '@ant-design/icons';
import React from 'react';

import Home from '../pages/Home';
import Redirect from '../components/Redirect';
import SuperInfo from '../pages/Admin/Super/Info';
import Role from '../pages/Admin/Super/Role';
import CommonInfo from '../pages/Admin/Common/Info';
import Permission from '../pages/Admin/Common/Permission';
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
		path: '/admin',
		name: '人员管理',
		icon: <TeamOutlined/>,
		element: <Redirect to="/admin/super/info"/>,
		routes: [
			{
				path: 'super',
				name: '管理员管理',
				icon: <CrownFilled/>,
				routes: [
					{
						path: 'info',
						name: '信息管理',
						icon: <InfoCircleOutlined/>,
						element: <SuperInfo/>,
					},
					// {
					// 	path: 'role',
					// 	name: '角色管理',
					// 	icon: <UserOutlined/>,
					// 	element: <Role/>,
					// },
				],
			},
			{
				path: 'common',
				name: '用户管理',
				icon: <UserSwitchOutlined/>,
				routes: [
					{
						path: 'info',
						name: '信息管理',
						icon: <InfoCircleOutlined/>,
						element: <CommonInfo/>,
					},
					// {
					// 	path: 'permission',
					// 	name: '权限管理',
					// 	icon: <SafetyOutlined/>,
					// 	element: <Permission/>,
					// },
				],
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
		element: <Redirect to="/layout/global/header"/>,
		routes: [
			{
				path: 'global',
				name: '全局组件',
				icon: <CrownFilled/>,
				routes: [
					{
						path: 'header',
						name: '网站头部',
						icon: <CrownFilled/>,
						element: <Header/>,
					},
				],
			},
			{
				path: 'home',
				name: '首页',
				icon: <CrownFilled/>,
				routes: [
					{
						path: 'category',
						name: '文章分类',
						icon: <CrownFilled/>,
						element: <Category/>,
					},
				],
			},
			{
				path: 'post',
				name: '文章详情页',
				icon: <CrownFilled/>,
				routes: [
					{
						path: 'theme',
						name: 'Markdown 主题',
						icon: <CrownFilled/>,
						element: <Markdown/>,
					},
				],
			},
		],
	},
];

export default menus;
