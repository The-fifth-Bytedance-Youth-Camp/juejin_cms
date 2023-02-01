import React from 'react';
import menu from './menu';
import appList from './appList';
import logo from '../assets/svg/logo-small.svg';

export const layoutConfig = {
	title: '掘金 CMS 系统',
	logo: <img style={ { width: '1em', height: '1em', margin: '.2em' } } src={ logo } alt="稀土掘金logo"/>,
	layout: 'mix',
	fixSiderbar: true,
	splitMenus: true,
	appList,
	route: {
		path: '/',
		routes: menu,
	},
	bgLayoutImgList: [
		{
			src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
			left: 85,
			bottom: 100,
			height: '303px',
		},
		{
			src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
			bottom: -68,
			right: -45,
			height: '303px',
		},
		{
			src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
			bottom: 0,
			left: 0,
			width: '331px',
		},
	],
};
