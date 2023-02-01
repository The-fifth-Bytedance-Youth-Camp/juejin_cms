import React from 'react';
import { Button, Result } from 'antd';
import PubSub from 'pubsub-js';

const NotFound = () => {
	const backHome = () => {
		PubSub?.publish('navigate', '/');
	};
	return <Result
		status="404"
		title="404"
		subTitle="你访问的页面不存在，点击下方按钮返回"
		extra={ <Button type="primary" onClick={ backHome }>返回首页</Button> }
	/>;
};
export default NotFound;
