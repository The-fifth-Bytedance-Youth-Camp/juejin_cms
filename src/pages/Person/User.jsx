import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import React, { Fragment } from 'react';
import { personApi } from '../../apis/person';
import {
	ModalForm,
	ProForm,
	ProFormDateRangePicker,
	ProFormSelect,
	ProFormText,
  } from '@ant-design/pro-components';

const Info = () => {
	const [ messageApi, contextHolder ] = message.useMessage();
	const columns = [
		{
			title: '编号',
			dataIndex: 'id',
		},
		{
			title: '用户名',
			dataIndex: 'name',
		},
		{
			title: '邮箱',
			dataIndex: 'email',
		},
		{
			title: '创建时间',
			dataIndex: 'gmt_created',
			valueType: 'date',
		},
		{
			title: '更新时间',
			dataIndex: 'gmt_modified',
			valueType: 'date',
		},
		{
			width: '12%',
			title: '操作',
			valueType: 'option',
			render: (text, { id,name,email,password }, _, action) => [
				<Popconfirm
					key="delete"
					title="删除普通用户"
					description="删除后无法恢复，确定要删除么？"
					onConfirm={ async () => {
						const { data: { code } } = await personApi.deleteCommon(id);
						if (code !== 200) {
							messageApi.open({
								type: 'error',
								content: '删除失败',
							});
							return;
						}
						action?.reload();
					} }
					okText="删除"
					cancelText="取消">
					<a key="delete">
						删除
					</a>
				</Popconfirm>,
				<ModalForm key='update'
					title="更新普通用户"
					trigger={
						<a key="update">更新</a>
					}
					submitTimeout={2000}
					onFinish={async (values) => {
						const { up_id,up_name,up_email,up_password } = values;
						const { data: { code } } = await personApi.updateCommon({ up_id,up_name,up_email,up_password });
						if(code==200){
							message.success('更新成功');
							action?.reload();
							return true;
						}else{
							message.error('更新失败');
							return false;
						}
					}}
				>
					<ProForm.Group>
						<ProFormText width="md" name="up_id" disabled label="编号" initialValue={`${ id }`}/>
					</ProForm.Group>
					<ProForm.Group>
						<ProFormText
						width="md"
						name="up_name"
						label="用户名"
						placeholder="请输入用户名"
						initialValue={`${ name }`}
						/>
					</ProForm.Group>
					<ProForm.Group>
						<ProFormText width="md" name="up_email" label="邮箱" placeholder="请输入邮箱" initialValue={`${ email }`}/>
					</ProForm.Group>
					<ProForm.Group>
						<ProFormText.Password width="md" name="up_password" label="密码" type="password" placeholder="请输入密码" initialValue={`${ password }`}/>
					</ProForm.Group>
				</ModalForm>,
			],
		},
	];
	return (
		<Fragment>
			<ProTable
				cardBordered
				columns={ columns }
				request = { async (params = {})=>{
					if(params.id===undefined){
						const { data:{ code,result } }=await personApi.searchAllCommon();
						if(code !== 200){
							return [];
						}
						//获取全部管理员信息
						let ret = [];
						// console.log(result[0][0]);
						for(const item in result[0]){
							ret.push(result[0][item]);
						}
						return {
							data: ret,
							success: code === 200,
						};
					}
					else{
						const { data:{ code,result } }=await personApi.searchCommonInfo(params.id,params.name);
						if(code !== 200){
							messageApi.open({
								type: 'error',
								content: '搜索失败',
							});
							return [];
						}
						//获取对应普通用户数据
						let ret = [];
						for (const item of result) {
							ret.push({ ...item });
						}
						return {
							data: ret,
							success: code === 200,
						};
					}
				}}
				rowKey="id"
				headerTitle="普通用户列表"
				toolBarRender={() => [
					<ModalForm key='insert'
						title="添加普通用户"
						trigger={
							<Button type="primary">
							<PlusOutlined />
							添加
							</Button>
						}
						submitTimeout={2000}
						onFinish={async (values) => {
							const { ad_name,ad_email,ad_password } = values;
							const { data: { code } } = await personApi.insertCommon({ ad_name,ad_email,ad_password });
							if(code==200){
								message.success('提交成功');
								return true;
							}else{
								message.error('提交失败');
								return false;
							}
						}}
					>
						 <ProForm.Group>
							<ProFormText
							width="md"
							name="ad_name"
							label="用户名"
							placeholder="请输入用户名"
							/>
						</ProForm.Group>
						<ProForm.Group>
							<ProFormText width="md" name="ad_email" label="邮箱" placeholder="请输入邮箱" />
						</ProForm.Group>
						<ProForm.Group>
							<ProFormText.Password width="md" name="ad_password" label="密码" type="password" placeholder="请输入密码" />
						</ProForm.Group>
					</ModalForm>,
				]}
			/>
		</Fragment>
	);
};

export default Info;
