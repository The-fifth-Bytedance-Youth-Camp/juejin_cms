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
	return markdown.replace(/!\[.+]/g, '')
								 .replace(/```.*```/g, '')
								 .replace(/>/g, '')
								 .replace(/`/g, '')
								 .replace(/#/g, '')
								 .replace(/\*/g, '')
								 .replace(/\r/g, '')
								 .replace(/\s+/g, ' ')
								 .trim();
}

function getMarkdownBrief(markdown = '', maxLength) {
	return removeMarkdownChars(markdown).replace(/\n/g, ' ').substring(0, maxLength);
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
		// 添加数据到 image 表
		setLoading(true);
		// 上传到服务器
		const { data: { code, url, pid } } = await postApi.uploadImage(file);
		if (code === 200 && pid) {
			messageApi.open({
				type: 'success',
				content: '图片上传成功',
			});
		} else {
			messageApi.open({
				type: 'error',
				content: '图片上传失败',
			});
			return '';
		}

		// 上传过的图片
		let cache_pid = localStorage.getItem('$cache_pid');
		if (cache_pid) {
			const pidList = JSON.parse(cache_pid);
			pidList.push(pid);
			localStorage.setItem('$cache_pid', JSON.stringify(pidList));
		} else {
			localStorage.setItem('$cache_pid', JSON.stringify([ pid ]));
		}
		setLoading(false);
		return url;
	}

	async function onFormChange({ title, cover, theme, codeStyle, category, tags }) {
		if (theme) setTheme(theme);
		if (codeStyle) setCodeStyle(codeStyle);
		let _cover;
		if (cover?.length && cover[0]?.response) _cover = cover[0]?.response?.pid;
		const { data: { code } } = await postApi.insertPostCache({
			cover: _cover,
			theme,
			title,
			codeStyle,
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
		let cover;
		if (res.cover?.length && res.cover[0]?.response) cover = res.cover[0]?.response?.pid;
		const brief = getMarkdownBrief(postContent, 100);
		const images = localStorage.getItem('$cache_pid');
		let { data: { code, insertId } } = await postApi.insertPost({ ...res, cover, content: postContent, brief, images });
		if (code === 200) {
			await messageApi.open({
				type: 'success',
				content: '上传成功',
			});
			// 跳转文章详情
			window.open(`http://localhost:3001/post/${ insertId }`, '_blank');
			location.reload();
		} else {
			messageApi.open({
				type: 'error',
				content: '上传失败',
			});
		}
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
									 setCacheContent(content || '');
									 setPostContent(content || '');
									 if (code !== 200) return { theme, codeStyle };
									 if (theme) setTheme(theme);
									 if (code_style) setCodeStyle(code_style);
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
