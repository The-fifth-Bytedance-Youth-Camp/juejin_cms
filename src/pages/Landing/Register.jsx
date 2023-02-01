import React, { useState } from 'react';
import { Button, Form, Input, message, Row, Space } from 'antd';

const Register = ({ cancel }) => {
	const [ loading, setLoading ] = useState(false);
	const [ messageApi, contextHolder ] = message.useMessage();
	const submit = (e) => {
		setLoading(true);
		console.log(e);
		setTimeout(async () => {
			setLoading(false);
			cancel();
			await messageApi.open({
				type: 'success',
				content: '申请成功，请等待审核',
				duration: 4,
			});
		}, 3000);
	};
	return (
		<Form onFinish={ submit }>
			{ contextHolder }
			<Form.Item
				name="name"
				label="用户名"
				rules={ [
					{
						required: true,
						message: '请输入用户名',
					},
				] }>
				<Input autoComplete="off"/>
			</Form.Item>
			<Form.Item
				name="password"
				label="密&nbsp;&nbsp;&nbsp;码"
				rules={ [
					{
						required: true,
						message: '请输入密码',
					},
				] }>
				<Input.Password autoComplete="off"/>
			</Form.Item>
			<Form.Item
				name="email"
				label="邮&nbsp;&nbsp;&nbsp;箱"
				rules={ [
					{
						required: true,
						message: '请输入邮箱',
					},
					{
						pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
						message: '邮箱地址不合法',
					},
				] }>
				<Input autoComplete="off"/>
			</Form.Item>
			<Form.Item>
				<Row justify="end">
					<Space>
						<Button type="primary" htmlType="submit" loading={ loading }>注册</Button>
						<Button onClick={ cancel }>取消</Button>
					</Space>
				</Row>
			</Form.Item>
		</Form>
	);
};

export default Register;
