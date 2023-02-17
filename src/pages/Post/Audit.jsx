import React, { Fragment, useState } from 'react';
import { Button, Space } from 'antd';
import { mdParser } from '../../utils/markdown';
import { Helmet } from 'react-helmet';

const Footer = () => {
	return (
		<div style={ {
			position: 'absolute',
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
		} }>
			<Space>
				<Button>不通过</Button>
				<Button type="primary">通过</Button>
			</Space>
		</div>
	);
};

const Audit = () => {
	const [ theme, setTheme ] = useState('juejin');
	const [ codeStyle, setCodeStyle ] = useState('atom-one-light');
	const [ content, setContent ] = useState('# 123\n\n```js\nconst a = 1;\n```\n');
	return (
		<div style={ { position: 'relative' } }>
			<Helmet>
				<link rel="stylesheet" href={ `http://localhost:3100/theme/${ theme }.css` }/>
				<link rel="stylesheet" href={ `http://localhost:3100/codeStyle/${ codeStyle }.css` }/>
			</Helmet>
			<div className="markdown-body"
					 dangerouslySetInnerHTML={ { __html: mdParser.render(content) } }/>
			<Footer/>
		</div>
	);
};

export default Audit;
