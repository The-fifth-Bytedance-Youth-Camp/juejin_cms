import React, { Fragment, useEffect, useRef, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import '../assets/styles/markdown-editor.css';
import Spinner from '../assets/svg/spinner';
import useScreenWidth from '../utils/hooks/useScreenWidth';
import { mdParser } from '../utils/markdown';

const flexCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

const MarkdownEditor = ({ loading, defaultValue, onChange, style = {}, onCacheUpload, onImageUpload }) => {
	const mdEditorRef = useRef(null);
	const [ cache, setCache ] = useState(defaultValue);
	const [ debouncedCache, setDebouncedCache ] = useState(defaultValue);
	const screenWidth = useScreenWidth();
	const [ height, setHeight ] = useState(undefined);

	const rootRef = useRef(null);

	useEffect(() => {
		setHeight(rootRef.current.offsetHeight);
	}, [ defaultValue ]);


	useEffect(() => {
		if (screenWidth < 767) {
			mdEditorRef?.current?.setView({ html: false });
		} else {
			mdEditorRef?.current?.setView({ html: true, md: true, menu: true });
		}
	}, [ screenWidth ]);

	useEffect(
		() => {
			const handler = setTimeout(() => {
				// 比较修改前后是否一样，避免资源浪费
				if (cache !== debouncedCache) {
					setDebouncedCache(cache);
				}
			}, 800);
			return () => clearTimeout(handler);
		},
		[ cache ],
	);

	// 上传服务器缓存
	useEffect(() => {
		if (debouncedCache !== undefined) {
			onCacheUpload(debouncedCache);
		}
	}, [ debouncedCache ]);

	const Loading = ({ msg }) => {
		return (
			<div style={ {
				userSelect: 'none',
				width: '100%',
				height: '100%',
				color: '#1677ff',
				backgroundColor: '#ffffff',
				border: '1px solid #ffffff',
				...flexCenter,
				position: 'absolute',
				top: 0,
				left: '50%',
				transform: 'translateX(-50%)',
				display: loading ? 'flex' : 'none',
				zIndex: '99999',
			} }>
				<div style={ { flexDirection: 'column', ...flexCenter } }>
					<Spinner/>
					<div>{ msg }</div>
				</div>
			</div>
		);
	};

	return (
		<div style={ { ...style, position: 'relative' } } ref={ rootRef }>
			{
				defaultValue !== undefined && height !== undefined ?
					<Fragment>
						<MdEditor
							shortcuts
							ref={ mdEditorRef }
							defaultValue={ defaultValue }
							placeholder="自动上传保存至服务器"
							style={ { height: `${ height - 16 }px` } }
							renderHTML={ text => mdParser.render(text) }
							onChange={ ({ text }) => {
								onChange(text);
								setCache(text);
							} }
							htmlClass="markdown-body"
							onImageUpload={ onImageUpload }/>
						<Loading msg="正在上传图片"/>
					</Fragment> :
					<Loading msg="正在加载草稿数据"/>
			}
		</div>
	);
};

export default MarkdownEditor;
