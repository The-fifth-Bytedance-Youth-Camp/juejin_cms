import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import React, { Fragment } from 'react';
import PubSub from 'pubsub-js';
import { postApi } from '../../apis/post';

const tagColor = [ 'magenta', 'volcano', 'orange', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'lime', 'gold' ];
let colorIndex = 0;
const colorMap = {};

const Search = () => {
	const [ messageApi, contextHolder ] = message.useMessage();
	const columns = [
		{
			title: '标题',
			dataIndex: 'title',
			onFilter: true,
			ellipsis: true,
			tip: '根据标题模糊搜索',
		},
		{
			width: '12%',
			title: '状态',
			valueType: 'select',
			dataIndex: 'state',
			onFilter: true,
			ellipsis: true,
			valueEnum: {
				'审核中': {
					text: '审核中',
					status: 'Processing',
				},
				'未过审': {
					text: '未过审',
					status: 'Error',
				},
				'已发布': {
					text: '已发布',
					status: 'Success',
				},
			},
		},
		{
			width: '10%',
			title: '分类',
			dataIndex: 'category',
			onFilter: true,
			ellipsis: true,
			async request({ keyWords }) {
				const { data: { result } } = await postApi.searchCategory(keyWords);
				return result.map(({ id, name }) => ({ label: name, value: id }));
			},
		},
		{
			title: '标签',
			valueType: 'treeSelect',
			dataIndex: 'tags',
			onFilter: true,
			ellipsis: true,
			fieldProps: {
				showSearch: true,
				filterTreeNode: true,
				multiple: true,
				treeNodeFilterProp: 'field',
			},
			async request({ keyWords }) {
				const { data: { result } } = await postApi.searchTag(keyWords);
				return result.map(({ id, name }) => ({ label: name, value: id }));
			},
			render(_, { tags }) {
				return (
					<Space wrap>
						{
							tags.map(({ id, name }) => {
								if (!colorMap[id]) colorMap[id] = tagColor[colorIndex++] || 'default';
								return (
									<Tag style={ { userSelect: 'none' } }
											 color={ colorMap[id] }
											 key={ id }>{ name }</Tag>
								);
							})
						}
					</Space>
				);
			},
		},
		{
			width: '14%',
			title: '创建时间',
			dataIndex: 'gmt_created',
			valueType: 'date',
			sorter: true,
			hideInSearch: true,
		},
		{
			title: '创建时间',
			valueType: 'dateRange',
			dataIndex: 'gmt_created',
			hideInTable: true,
			search: {
				transform: (value) => ({
					startTime: value[0],
					endTime: value[1],
				}),
			},
		},
		{
			width: '12%',
			title: '操作',
			valueType: 'option',
			render: (text, { id }, _, action) => [
				<a key="view" target="_blank" href={ `http://localhost:3001/post/${ id }` } rel="noreferrer">
					查看
				</a>,
				<Popconfirm
					key="delete"
					title="删除文章"
					description="删除后无法恢复，确定要删除么？"
					onConfirm={ async () => {
						const { data: { code } } = await postApi.deletePost(id);
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
			],
		},
	];
	return (
		<Fragment>
			{ contextHolder }
			<ProTable
				cardBordered
				columns={ columns }
				request={ async (params = {}, { gmt_created: gmt_created_sort }) => {
					const { data: { code, result } } = await postApi.searchPost(params);
					if (code !== 200) {
						messageApi.open({
							type: 'error',
							content: '搜索失败',
						});
						return [];
					}
					// 获取文章的详情数据
					let ret = [];
					for (const item of result) {
						const { data } = await postApi.findPostTags(item.id);
						ret.push({ ...item, tags: data.result });
					}
					if (gmt_created_sort !== undefined) {
						// 从小到大
						if (gmt_created_sort === 'ascend') {
							ret = ret.sort(({ gmt_created: a }, { gmt_created: b }) => new Date(a) - new Date(b));
						}
						// 从大到小
						else {
							ret = ret.sort(({ gmt_created: a }, { gmt_created: b }) => new Date(b) - new Date(a));
						}
					}
					return {
						data: ret,
						success: code === 200,
						page: params?.current,
					};
				} }
				columnsState={ {
					persistenceKey: 'search-post-table',
					persistenceType: 'localStorage',
				} }
				rowKey="id"
				search={ { labelWidth: 'auto' } }
				// options={ { setting: { listsHeight: 400 } } }
				form={ {
					// 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
					syncToUrl(values, type) {
						if (type === 'get') {
							return {
								...values,
								gmt_created: [ values.startTime, values.endTime ],
							};
						}
						return values;
					},
				} }
				pagination={ {
					pageSize: 10,
					// onChange(page) {
					// 	console.log(page);
					// },
				} }
				dateFormatter="string"
				headerTitle="文章列表"
				toolBarRender={ () => [
					<Button onClick={ () => PubSub?.publish('navigate', '/post/insert') }
									key="button" icon={ <PlusOutlined/> } type="primary">
						新建
					</Button>,
				] }
			/>
		</Fragment>
	);
};

export default Search;
