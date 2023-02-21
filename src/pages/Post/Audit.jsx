import React, { useEffect, useState } from 'react';
import { message, Space, Tag } from 'antd';
import { ProList } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../../apis/post';

const tagColor = [ 'magenta', 'volcano', 'orange', 'green', 'cyan', 'blue', 'geekblue', 'purple', 'lime', 'gold' ];
let colorIndex = 0;
const colorMap = {};

const Audit = () => {
	const [ dataSource, setDataSource ] = useState([]);
	const navigate = useNavigate();
	const [ messageApi, contextHolder ] = message.useMessage();
	const [ loading, setLoading ] = useState(true);
	const getData = async () => {
		const { data: { code, rows } } = await postApi.findPostByState('审核中');
		if (code !== 200) {
			messageApi.open({
				type: 'error',
				content: '数据获取失败',
			});
			return;
		}
		setDataSource(rows);
	};

	useEffect(() => {
		(async () => {
			await getData();
		})();
		setLoading(false);
	}, []);

	return (
		<div style={ { width: '100%', height: '100%', overflow: 'auto' } }>
			{ contextHolder }
			<h1 style={ { padding: '0 48px 10px' } }>待审列表</h1>
			<ProList
				loading={ loading }
				rowKey="id"
				dataSource={ dataSource }
				showActions="hover"
				onDataSourceChange={ setDataSource }
				metas={ {
					title: {
						dataIndex: 'title',
					},
					description: {
						dataIndex: 'brief',
					},
					subTitle: {
						render: (_, { tags = [] }) => {
							return (
								<Space>
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
					avatar: {
						render: (dom, { title, cover }) =>
							cover && <img
								height={ 80 }
								src={ cover }
								alt={ `${ title }_封面` }
							/>,
					},
					actions: {
						render: (dom, { id }) => [
							<a key="link"
								 onClick={ () => navigate(`/post/audit/${ id }`) }>
								审核
							</a>,
						],
					},
				} }
			/>
		</div>
	);
};

export default Audit;
