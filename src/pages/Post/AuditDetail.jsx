import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { mdParser } from '../../utils/markdown';
import { Button, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { postApi } from '../../apis/post';

const Footer = () => {
	return (
		<div style={ {
			position: 'absolute',
			right: 0,
			bottom: 0,
			display: 'flex',
			justifyContent: 'flex-end',
			alignItems: 'center',
			margin: '0 24px 24px 0',
		} }>
			<Space>
				<Button>不通过</Button>
				<Button type="primary">通过</Button>
			</Space>
		</div>
	);
};

const AuditDetail = () => {
	const [ theme, setTheme ] = useState('juejin');
	const [ codeStyle, setCodeStyle ] = useState('atom-one-light');
	const [ content, setContent ] = useState('# 123\n\n```js\nconst a = 1;\n```\n');
	const navigate = useNavigate();
	const { id } = useParams();

	useEffect(() => {
		(async () => {
			const { data } = await postApi.finPostById(id);
			// setContent
		})();
	}, []);


	return (
		<div style={ { height: '100%', paddingBottom: '56px' } }>
			<Helmet>
				<link rel="stylesheet" href={ `http://localhost:3100/theme/${ theme }.css` }/>
				<link rel="stylesheet" href={ `http://localhost:3100/codeStyle/${ codeStyle }.css` }/>
			</Helmet>
			<div className="content" style={ { height: '100%', overflow: 'auto' } }>
				<div style={ { display: 'flex', alignItems: 'center', userSelect: 'none' } }>
					<div style={ { fontSize: '16px', marginRight: '2em' } }
							 onClick={ () => navigate('/post/audit') }>
						<LeftOutlined/> 返回
					</div>
					<h1 style={ {
						fontSize: '32px',
						flex: 1,
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
					} }>Title</h1>
				</div>
				<h4 style={ { textAlign: 'right' } }>作者: NCK</h4>
				<div className="markdown-body"
						 dangerouslySetInnerHTML={ { __html: mdParser.render(content) } }/>
			</div>
			<Footer/>
		</div>
	);
};

export default AuditDetail;
