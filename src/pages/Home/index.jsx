import React, { useEffect, useState } from 'react';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import useScreenWidth from '../../utils/hooks/useScreenWidth';
import PieChart from '../../components/PieChart';
import LineChart from '../../components/LineChart';
import { postApi } from '../../apis/post';

const { Statistic } = StatisticCard;

const { Divider } = StatisticCard;

const Home = () => {
	const screenWidth = useScreenWidth();
	const [ websiteWatchData, setWebsiteWatchData ] = useState([]);
	const [ categoryData, setCategoryData ] = useState([]);
	const [ allowCount, setAllowCount ] = useState(0);
	const [ auditCount, setAuditCount ] = useState(0);
	const [ disallowCount, setDisallowCount ] = useState(0);

	useEffect(() => {
		asyncFetch();
		(async () => {
			const { data: { result } } = await postApi.categoryPostCount();
			setCategoryData(result.map(({ name, count }) => ({ type: name, value: count })));
			const { data: { result: stateCount } } = await postApi.statePostCount();
			setAuditCount(stateCount['审核中'] || 0);
			setDisallowCount(stateCount['未过审'] || 0);
			setAllowCount(stateCount['已发布'] || 0);
		})();
	}, []);

	const asyncFetch = () => {
		fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
			.then((response) => response.json())
			.then((json) => setWebsiteWatchData(json))
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
						value: auditCount + disallowCount + allowCount,
					} }
				/>
				<Divider/>
				<StatisticCard
					statistic={ {
						title: '审核中',
						value: auditCount || '-',
						status: 'processing',
					} }
				/>
				<StatisticCard
					statistic={ {
						title: '未过审',
						value: disallowCount || '-',
						status: 'error',
					} }
				/>
				<StatisticCard
					statistic={ {
						title: '已发布',
						value: allowCount || '-',
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
								value: 0,
								description: <Statistic title="较本月平均阅读量" value="x.xx%" trend="down"/>,
							} }
						/>
						<Divider/>
						<StatisticCard
							statistic={ {
								title: '本月累计阅读量',
								value: 0,
								description: <Statistic title="月同比" value="x.xx%" trend="up"/>,
							} }
						/>
					</StatisticCard.Group>
					<LineChart data={ websiteWatchData }/>
				</ProCard>
				{ /* 右侧 */ }
				<PieChart data={ categoryData }/>
			</ProCard>
			{ /* 图表区域 */ }
		</ProCard>
	);
};

export default Home;
