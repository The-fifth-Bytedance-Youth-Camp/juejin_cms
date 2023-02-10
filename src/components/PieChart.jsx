import React from 'react';
import { measureTextWidth, Pie } from '@ant-design/plots';
import useScreenWidth from '../utils/hooks/useScreenWidth';

function renderStatistic(containerWidth, text, style) {
	const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
	const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

	let scale = 1;

	if (containerWidth < textWidth) {
		scale = Math.min(Math.sqrt(Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2)))), 1);
	}

	const textStyleStr = `width:${ containerWidth }px;`;
	return `<div style="${ textStyleStr };font-size:${ scale }em;line-height:${ scale < 1 ? 1 : 'inherit' };">${ text }</div>`;
}

const getStyle = (fontSize) => ({
	color: 'rgba(0, 0, 0, 0.88)',
	fontSize,
	userSelect: 'none',
	textAlign: 'center',
});

const PieChart = ({ data }) => {
	let screenWidth = useScreenWidth();
	if (!screenWidth) screenWidth = window.innerWidth;
	const config = {
		width: (screenWidth - 128) / 2,
		appendPadding: 24,
		data,
		angleField: 'value',
		colorField: 'type',
		radius: 1,
		innerRadius: 0.6,
		meta: { value: { formatter: (v) => `共 ${ v } 篇` } },
		label: {
			type: 'inner',
			offset: '-50%',
			style: { textAlign: 'center' },
			autoRotate: false,
			content: ({ percent }) => `${ (percent * 100).toFixed(0) }%`,
		},
		statistic: {
			title: {
				offsetY: -4,
				customHtml(container, view, datum) {
					const { width, height } = container.getBoundingClientRect();
					const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
					const text = datum ? datum.type : '总计';
					return renderStatistic(d, text, { fontSize: 28 });
				},
			},
			content: {
				offsetY: 4,
				style: { fontSize: '32px' },
				customHtml(container, view, datum, data) {
					const { width } = container.getBoundingClientRect();
					const text = datum ? `共 ${ datum.value } 篇` : `共 ${ data.reduce((r, d) => r + d.value, 0) } 篇`;
					return renderStatistic(width, text, { fontSize: 32 });
				},
			},
		},
		// 添加 中心统计文本 交互
		interactions: [
			{ type: 'element-selected' },
			{ type: 'element-active' },
			{ type: 'pie-statistic-active' },
		],
	};
	return (
		<div>
			<div style={ {
				paddingTop: '32px',
				paddingBottom: '16px',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			} }>
				<div style={ { ...getStyle('22px'), paddingBottom: '4px' } }>各分类文章数量统计</div>
				<div style={ getStyle('12px') }>截止 2022-12-31 10:00:10</div>
			</div>
			<Pie { ...config } />
		</div>
	);
};

export default PieChart;
