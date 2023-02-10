import React from 'react';
import { Bar } from '@ant-design/plots';

const BarChart = ({ data }) => {
	const config = {
		data,
		xField: 'value',
		yField: 'year',
		seriesField: 'year',
		legend: { position: 'top-left' },
	};
	return <Bar { ...config } />;
};

export default BarChart;
