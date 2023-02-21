import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { mdParser } from '../../utils/markdown';
import { Button, message, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { postApi } from '../../apis/post';
import { personApi } from '../../apis/person';

const AuditDetail = () => {
	const [ title, setTitle ] = useState(null);
	const [ theme, setTheme ] = useState('juejin');
	const [ codeStyle, setCodeStyle ] = useState('atom-one-light');
	const [ content, setContent ] = useState('');
	const navigate = useNavigate();
	const { id } = useParams();
	const [ author, setAuthor ] = useState('');
	const [ messageApi, contextHolder ] = message.useMessage();

	const updateState = (state) => {
		return async () => {
			const { data: { code } } = await postApi.updatePostState(id, state);
			if (code !== 200) {
				messageApi.open({
					type: 'error',
					content: '状态更新失败',
				});
				return;
			}
			navigate('/post/audit');
		};
	};

	useEffect(() => {
		(async () => {
			const { data: { theme, title, content, code_style, author } } = await postApi.finPostById(id);
			setContent(content);
			setTheme(theme);
			setCodeStyle(code_style);
			setTitle(title);
			const { data: { result } } = await personApi.searchSuperInfo(author);
			const { name } = result[0];
			setAuthor(name);
		})();
	}, []);


	return (
		<div style={ { height: '100%', paddingBottom: '56px' } }>
			{ contextHolder }
			<Helmet>
				<link rel="stylesheet" href={ `http://localhost:3100/theme/${ theme }.css` }/>
				<link rel="stylesheet" href={ `http://localhost:3100/codeStyle/${ codeStyle }.css` }/>
			</Helmet>
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
				} }>{ title }</h1>
			</div>
			<h4 style={ { textAlign: 'right' } }>作者: { author }</h4>
			<div className="content" style={ { height: 'calc(100% - 104px)', overflow: 'auto', marginTop: '20px' } }>
				<div className="markdown-body"
						 dangerouslySetInnerHTML={ { __html: mdParser.render(content) } }/>
			</div>
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
					<Button onClick={ updateState('未过审') }>不通过</Button>
					<Button type="primary" onClick={ updateState('已发布') }>通过</Button>
				</Space>
			</div>
		</div>
	);
};

export default AuditDetail;
