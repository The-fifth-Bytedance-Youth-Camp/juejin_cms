import React from 'react';
import { Line } from '@ant-design/plots';
import useScreenWidth from '../utils/hooks/useScreenWidth';
import moment from 'moment';

const getStyle = (fontSize) => ({
	color: 'rgba(0, 0, 0, 0.88)',
	fontSize,
	width: '100%',
	textAlign: 'center',
	userSelect: 'none',
});

const LineChart = ({ data }) => {
	let screenWidth = useScreenWidth();
	if (!screenWidth) screenWidth = window.innerWidth;
	const config = {
		width: (screenWidth - 128) / 2,
		appendPadding: 24,
		data,
		xField: 'date',
		yField: 'num',
		xAxis: { tickCount: 5 },
		smooth: true,
	};
	return (
		<div>
			<div style={ { ...getStyle('22px'), padding: '20px 0 4px' } }>网站流量趋势</div>
			<div style={ {
				...getStyle('12px'),
				paddingBottom: '16px',
			} }>{ moment().subtract(1, 'month').format('YYYY-MM-DD') } ~ { moment().format('YYYY-MM-DD') }</div>
			<Line { ...config } />
		</div>
	);
};

export default LineChart;
