import React, { Fragment, useEffect, useState } from 'react';
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

const Insert = () => {
	const [ theme, setTheme ] = useState('juejin');
	const [ codeStyle, setCodeStyle ] = useState('atom-one-light');
	const screenWidth = useScreenWidth();
	const [ cacheContent, setCacheContent ] = useState(undefined);
	const [ postContent, setPostContent ] = useState(null);
	const [ messageApi, contextHolder ] = message.useMessage();

	// 获取缓存内容
	useEffect(() => {
		(async () => {
			let { data: { code, content } } = await postApi.getPostCache();
			if (code !== 200) {
				messageApi.open({
					type: 'error',
					content: '获取缓存失败',
				});
			}
			if (content === null) content = '';
			setCacheContent(content);
			setPostContent(content);
		})();
	}, []);

	async function cacheUpload(cache) {
		const { data: { code } } = await postApi.insertPostCache(cache);
		if (code !== 200) {
			messageApi.open({
				type: 'error',
				content: '自动保存失败',
			});
		}
	}

	function imageUpload(file, callback) {
		const formData = new FormData();
		formData.append('file', file);
		// 上传到服务器
		callback('https://avatars0.githubusercontent.com/u/21263805?s=40&v=4');
		const res = 'da2djq3k';
	}


	function onFormChange({ theme, codeStyle }) {
		if (theme) setTheme(theme);
		if (codeStyle) setCodeStyle(codeStyle);
	}

	async function onFinish(res) {
		const cover = res?.cover[0].response.pid;
		console.log({ ...res, cover, content: postContent });
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
							 initialValues={ {
								 theme: 'juejin',
								 codeStyle: 'atom-one-light',
							 } }
							 submitter={ {
								 render: (props, dom) => <Space style={ { marginTop: '24px' } }>{ dom }</Space>,
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
						debounceTime={ 300 }
						request={ async ({ keyWords }) => {
							const { data: { result } } = await postApi.searchCategory(keyWords);
							return result.map(t => ({ value: t, label: t }));
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
							return result.map(t => ({ value: t, label: t }));
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
															 listType="text" action="http://localhost:3100/upload/cover"/>
				</ProFormGroup>
				{ contextHolder }
				<MarkdownEditor style={ { flex: 1 } } defaultValue={ cacheContent } onChange={ setPostContent }
												onCacheUpload={ cacheUpload } onImageUpload={ imageUpload }/>
			</ProForm>
		</Fragment>
	);
};

export default Insert;
