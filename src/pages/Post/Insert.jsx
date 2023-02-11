import React, { Fragment, useState } from 'react';
import MarkdownEditor from '../../components/MarkdownEditor';
import {
	ProForm,
	ProFormGroup,
	ProFormSelect,
	ProFormText,
	ProFormUploadButton,
} from '@ant-design/pro-components';
import useScreenWidth from '../../utils/hooks/useScreenWidth';
import { message, Space, Typography } from 'antd';
import { Helmet } from 'react-helmet';
import { postApi } from '../../apis/post';

const { Title } = Typography;

// 去除 markdown 字符
function removeMarkdownChars(markdown) {
	return markdown.replace(/\n```.*```\n/g, '')
								 .replace(/`/g, '')
								 .replace(/\*\*/g, '')
								 .replace(/\*/g, '')
								 .replace(/#/g, '')
								 .replace(/\[/g, '')
								 .replace(/]/g, '')
								 .replace(/\(/g, '')
								 .replace(/\)/g, '')
								 .replace(/_/g, '');
}

function getMarkdownBrief(markdown = '', maxLength) {
	const sentences = removeMarkdownChars(markdown).match(/[^\n.!?]+[\n.!?]+/g);
	if (!sentences) return markdown;
	let extractedSentence = '';
	for (const sentence of sentences) {
		if (extractedSentence.length + sentence.length < maxLength) {
			extractedSentence += sentence;
		} else {
			break;
		}
	}
	return extractedSentence.replace(/\n/g, ' ');
}

const Insert = () => {
	const [ theme, setTheme ] = useState('juejin');
	const [ codeStyle, setCodeStyle ] = useState('atom-one-light');
	const screenWidth = useScreenWidth();
	const [ cacheContent, setCacheContent ] = useState(undefined);
	const [ postContent, setPostContent ] = useState(null);
	const [ messageApi, contextHolder ] = message.useMessage();
	const [ loading, setLoading ] = useState(false);

	async function cacheUpload(cache) {
		const { data: { code } } = await postApi.insertPostCache({ content: cache });
		if (code !== 200) {
			messageApi.open({
				type: 'error',
				content: '自动保存失败',
			});
		}
	}

	async function imageUpload(file) {
		setLoading(true);
		// 上传到服务器
		const { data: { url } } = await postApi.uploadImage(file);
		setLoading(false);
		messageApi.open({
			type: 'success',
			content: '图片上传成功',
		});
		return url;
	}

	async function onFormChange({ title, cover, theme, codeStyle, category, tags }) {
		console.log({ title, cover, theme, codeStyle, category, tags });
		let _cover;
		if (cover?.length && cover[0]?.response) _cover = cover[0]?.response?.pid;
		const { data: { code } } = await postApi.insertPostCache({
			cover: _cover,
			theme,
			title,
			code_style: codeStyle,
			category,
			tags,
		});
		if (code !== 200) {
			messageApi.open({
				type: 'error',
				content: '自动保存失败',
			});
		}
	}

	async function onFinish(res) {
		const cover = res?.cover[0].response.pid;
		const brief = getMarkdownBrief(postContent, 100);
		console.log({ ...res, cover, content: postContent, brief });
	}

	return (
		<Fragment>
			<Helmet>
				<link rel="stylesheet" href={ `http://localhost:3100/theme/${ theme }.css` }/>
				<link rel="stylesheet" href={ `http://localhost:3100/codeStyle/${ codeStyle }.css` }/>
			</Helmet>
			<ProForm autoFocusFirstInput
							 onValuesChange={ onFormChange }
							 style={ { height: '100%', display: 'flex', flexDirection: 'column', paddingBottom: '8px' } }
							 name="post" onFinish={ onFinish } layout={ screenWidth < 767 ? 'vertical' : 'horizontal' }
							 request={
								 async () => {
									 let {
										 data: {
											 code,
											 title,
											 category,
											 cover,
											 content,
											 tags,
											 theme,
											 code_style,
										 },
									 } = await postApi.getPostCache();
									 if (content === null) content = '';
									 setCacheContent(content);
									 setPostContent(content);
									 if (code !== 200) return { theme, codeStyle };
									 setTheme(theme);
									 setCodeStyle(code_style);
									 console.log({ theme, codeStyle, category, cover, title, tags });
									 return { theme, codeStyle, category, cover, title, tags };
								 }
							 }
							 submitter={ {
								 render: (props, dom) =>
									 <Space style={ { marginTop: '24px', justifyContent: 'flex-end' } }>{ dom }</Space>,
							 } }>
				<Title level={ 3 } style={ { marginTop: '8px', marginBottom: '24px' } }>添加文章</Title>
				<ProFormGroup>
					<ProFormText
						width={ screenWidth < 767 ? 'sm' : 'md' }
						name="title"
						label="标题"
						rules={ [ { required: true, message: '请输入文章标题' } ] }/>
					<ProFormSelect
						showSearch
						width={ screenWidth > 591 ? 'sm' : 'xs' }
						name="category"
						label="分类"
						max={ 4 }
						debounceTime={ 300 }
						request={ async ({ keyWords }) => {
							const { data: { result } } = await postApi.searchCategory(keyWords);
							return result.map(({ id, name }) => ({ value: id, label: name }));
						} }
						rules={ [ { required: true, message: '请选择一个文章分类' } ] }
					/>
					<ProFormSelect
						showSearch
						width={ screenWidth > 591 ? 'sm' : 'xs' }
						name="tags"
						label="标签"
						debounceTime={ 300 }
						request={ async ({ keyWords }) => {
							const { data: { result } } = await postApi.searchTag(keyWords);
							return result.map(({ id, name }) => ({ value: id, label: name }));
						} }
						fieldProps={ { mode: 'multiple' } }
						rules={ [ { required: true, message: '至少选择一个标签', type: 'array' } ] }
					/>
					<ProFormSelect
						showSearch
						width={ screenWidth > 591 ? 'sm' : 'xs' }
						name="theme"
						label="主题"
						debounceTime={ 300 }
						request={ async ({ keyWords }) => {
							const { data: { result } } = await postApi.searchTheme(keyWords);
							return result.map(t => ({ value: t, label: t }));
						} }
						rules={ [ { required: true, message: '请选择主题' } ] }
					/>
					<ProFormSelect
						showSearch
						width={ screenWidth > 591 ? 'sm' : 'xs' }
						name="codeStyle"
						label="代码样式"
						debounceTime={ 300 }
						request={ async ({ keyWords }) => {
							const { data: { result } } = await postApi.searchCodeStyle(keyWords);
							return result.map(t => ({ value: t, label: t }));
						} }
						rules={ [ { required: true, message: '请选择代码样式' } ] }
					/>
					<ProFormUploadButton name="cover" label="封面" max={ 1 }
															 listType="text" action="http://localhost:3100/upload/image"/>
				</ProFormGroup>
				{ contextHolder }
				<MarkdownEditor loading={ loading } style={ { flex: 1 } } defaultValue={ cacheContent }
												onChange={ setPostContent } onCacheUpload={ cacheUpload } onImageUpload={ imageUpload }/>
			</ProForm>
		</Fragment>
	);
};

export default Insert;
