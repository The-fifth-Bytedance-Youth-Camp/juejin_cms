import React, { useEffect, useState } from 'react';
import { ProCard, StatisticCard } from '@ant-design/pro-components';
import useScreenWidth from '../../utils/hooks/useScreenWidth';
import PieChart from '../../components/PieChart';
import LineChart from '../../components/LineChart';
import { postApi } from '../../apis/post';
import moment from 'moment';

const { Statistic } = StatisticCard;

const { Divider } = StatisticCard;

const Home = () => {
	const screenWidth = useScreenWidth();
	const [ websiteWatchData, setWebsiteWatchData ] = useState([]);
	const [ categoryData, setCategoryData ] = useState([]);
	const [ allowCount, setAllowCount ] = useState(0);
	const [ auditCount, setAuditCount ] = useState(0);
	const [ disallowCount, setDisallowCount ] = useState(0);
	const [ yesterdayWatch, setYesterdayWatch ] = useState(0);
	const [ averageWatch, setAverageWatch ] = useState(0);
	const [ monthWatch, setMonthWatch ] = useState(0);
	const [ compareLastMonth, setCompareLastMonth ] = useState(0);

	useEffect(() => {
		(async () => {
			let { data: { result: watchDataResult } } = await postApi.getWebsiteWatch(
				moment().subtract(1, 'months').format('YYYY-MM-DD'),
				moment().format('YYYY-MM-DD'),
			);
			watchDataResult = watchDataResult.map(item => ({ ...item, date: moment(item?.date).format('YYYY-MM-DD') }));
			setWebsiteWatchData(watchDataResult);
			const { data: { result } } = await postApi.categoryPostCount();
			setCategoryData(result.map(({ name, count }) => ({ type: name, value: count })));
			const { data: { result: stateCount } } = await postApi.statePostCount();
			setAuditCount(stateCount['审核中'] || 0);
			setDisallowCount(stateCount['未过审'] || 0);
			setAllowCount(stateCount['已发布'] || 0);
			const { data: { num: yesterdayWatch } } = await postApi.getWebsiteWatchDay(moment().subtract(1, 'days').format('YYYY-MM-DD'));
			setYesterdayWatch(yesterdayWatch);
			setMonthWatch(watchDataResult.reduce((accumulator, currentValue) => accumulator + currentValue.num, 0));
			setAverageWatch((yesterdayWatch - monthWatch / watchDataResult.length).toFixed(2));
			let { data: { result: lastMonthWatch } } = await postApi.getWebsiteWatch(
				moment().subtract(2, 'months').format('YYYY-MM-DD'),
				moment().subtract(1, 'months').format('YYYY-MM-DD'),
			);
			const lastMonthWatchNum = lastMonthWatch.reduce((accumulator, currentValue) => accumulator + currentValue.num, 0);
			let temp = (monthWatch - lastMonthWatchNum / monthWatch).toFixed(2);
			if (isNaN(temp)) temp = 0;
			setCompareLastMonth(temp);
		})();
	}, []);

	function getDateStr() {
		const date = new Date();
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const weekday = date.getDay();
		return year + '年' + month + '月' + day + '日 ' + '星期' + [ '日', '一', '二', '三', '四', '五', '六' ][weekday];
	}

	return (
		<ProCard
			headerBordered
			title="数据概览"
			extra={ getDateStr() }
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
								value: yesterdayWatch,
								description: <Statistic title="较本月平均阅读量" value={ `${ averageWatch }%` }
																				trend={ averageWatch >= 0 ? 'up' : 'down' }/>,
							} }
						/>
						<Divider/>
						<StatisticCard
							statistic={ {
								title: '本月累计阅读量',
								value: monthWatch,
								description: <Statistic title="较上月" value={ `${ compareLastMonth }%` }
																				trend={ compareLastMonth >= 0 ? 'up' : 'down' }/>,
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
