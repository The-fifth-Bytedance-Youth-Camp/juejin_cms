import React, { useEffect, useState } from 'react';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import useScreenWidth from '../../utils/hooks/useScreenWidth';
import PieChart from '../../components/PieChart';
import LineChart from '../../components/LineChart';

const { Statistic } = StatisticCard;

const { Divider } = StatisticCard;

const categoryData = [
	{
		type: '前端', value: 27,
	},
	{
		type: '后端', value: 25,
	},
	{
		type: 'Android', value: 18,
	},
	{
		type: 'iOS', value: 15,
	},
	{
		type: '人工智能', value: 10,
	},
	{
		type: '开发工具', value: 5,
	},
];

const barData = [
	{
		year: '1957 年',
		value: 145,
	},
	{
		year: '1956 年',
		value: 61,
	},
	{
		year: '1952 年',
		value: 52,
	},
	{
		year: '1951 年',
		value: 38,
	},
];

const Home = () => {
	const screenWidth = useScreenWidth();
	const [ data, setData ] = useState([]);

	useEffect(() => {
		asyncFetch();
	}, []);

	const asyncFetch = () => {
		fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
			.then((response) => response.json())
			.then((json) => setData(json))
			.catch((error) => {
				console.log('fetch data failed', error);
			});
	};
	return (
		<ProCard
			headerBordered
			title="数据概览"
			extra="2019年9月28日 星期五"
			split="horizontal">
			{ /* 顶栏 */ }
			<StatisticCard.Group style={ { paddingTop: '16px' } }>
				<StatisticCard
					statistic={ {
						title: '全部',
						tip: '全站文章数量',
						value: 10,
					} }
				/>
				<Divider/>
				<StatisticCard
					statistic={ {
						title: '审核中',
						value: 3,
						status: 'processing',
					} }
				/>
				<StatisticCard
					statistic={ {
						title: '未过审',
						value: '-',
						status: 'error',
					} }
				/>
				<StatisticCard
					statistic={ {
						title: '已发布',
						value: 100,
						status: 'success',
					} }
				/>
			</StatisticCard.Group>
			{ /* 图表区域 */ }
			<ProCard split={ screenWidth >= 766 ? 'vertical' : 'horizontal' }>
				{ /* 左侧 */ }
				<ProCard split="horizontal">
					<StatisticCard.Group style={ { borderTop: 'rgba(5, 5, 5, 0.06)' } }>
						<StatisticCard
							statistic={ {
								title: '昨日全部阅读量',
								value: 234,
								description: <Statistic title="较本月平均阅读量" value="8.04%" trend="down"/>,
							} }
						/>
						<Divider/>
						<StatisticCard
							statistic={ {
								title: '本月累计阅读量',
								value: 234,
								description: <Statistic title="月同比" value="8.04%" trend="up"/>,
							} }
						/>
					</StatisticCard.Group>
					<LineChart data={ data }/>
				</ProCard>
				{ /* 右侧 */ }
				<PieChart data={ categoryData }/>
			</ProCard>
			{ /* 图表区域 */ }
		</ProCard>
	);
};

export default Home;
