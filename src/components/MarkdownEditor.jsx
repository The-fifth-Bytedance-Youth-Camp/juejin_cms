import React, { useEffect, useRef, useState } from 'react';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import emoji from 'markdown-it-emoji';
import subscript from 'markdown-it-sub';
import superscript from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import deflist from 'markdown-it-deflist';
import abbreviation from 'markdown-it-abbr';
import insert from 'markdown-it-ins';
import mark from 'markdown-it-mark';
import tasklists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import '../assets/styles/markdown-editor.css';
import spinner from '../assets/svg/spinner.svg';
import useScreenWidth from '../utils/hooks/useScreenWidth';
import ReactDOMServer from 'react-dom/server';

const flexCenter = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
};

const linkTarget = (md) => {
	const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};
	md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
		tokens[idx].attrPush([ 'target', '_blank' ]);
		return defaultRender(tokens, idx, options, env, self);
	};
};

const codeColor = (md) => {
	const defaultRender = md.renderer.rules.code_inline || function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};
	md.renderer.rules.code_inline = function (tokens, idx, options, env, self) {
		tokens[idx].attrPush([
			'style',
			'color: #ff502c;' +
			'background-color: #fff5f5;' +
			'border-radius: 2px;' +
			'font-size: .87em;' +
			'padding: .065em .4em;',
		]);
		return defaultRender(tokens, idx, options, env, self);
	};
};

const copyCode = (md) => {
	// 使用MarkdownIt的自定义标签功能添加复制按钮和语言类型展示
	md.renderer.rules.fence = function (tokens, idx) {
		const token = tokens[idx];
		const code = token.content.trim();
		const copyCodeStyle = {
			fontSize: '12px',
			color: 'hsla(0,0%,54.9%,.8)',
			position: 'absolute',
			top: '6px',
			right: '15px',
			userSelect: 'none',
		};
		let language = token.info;
		let codeHtml = code;
		try {
			if (hljs.getLanguage(language)) {
				codeHtml = hljs.highlight(code, { language }).value;
			}
		} catch (_) { }
		return ReactDOMServer.renderToString(
			<pre className={ `language-${ language }` } style={ { position: 'relative' } }>
					<code className={ `language-${ language }` } dangerouslySetInnerHTML={ { __html: codeHtml } }/>
					<span style={ copyCodeStyle }>
						{ language }&nbsp;<span style={ { cursor: 'pointer' } }>复制代码</span>
					</span>
			</pre>,
		);
	};
};

const addMarkdownBodyClass = function (md) {
	const defaultRender = md.renderer.render;
	md.renderer.render = function (tokens, options, env) {
		let result = defaultRender.call(this, tokens, options, env);
		result = `<div class="markdown-body">${ result }</div>`;
		return result;
	};
};

const mdParser = new MarkdownIt({
	linkify: true,
	typographer: true,
})
	.use(addMarkdownBodyClass)
	.use(emoji)
	.use(subscript)
	.use(superscript)
	.use(footnote)
	.use(deflist)
	.use(abbreviation)
	.use(insert)
	.use(mark)
	.use(copyCode)
	.use(codeColor)
	.use(linkTarget)
	.use(tasklists, { enabled: true });

const MarkdownEditor = ({ defaultValue, onChange, style = {}, onCacheUpload, onImageUpload }) => {
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
			}, 1500);
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

	return (
		<div style={ style } ref={ rootRef }>
			{
				defaultValue !== undefined && height !== undefined ?
					<MdEditor
						ref={ mdEditorRef }
						defaultValue={ defaultValue }
						shortcuts
						placeholder="自动上传保存至服务器"
						style={ { height: `${ height }px` } }
						renderHTML={ text => mdParser.render(text) }
						onChange={ ({ text }) => {
							onChange(text);
							setCache(text);
						} }
						onImageUpload={ onImageUpload }/> :
					<div style={ {
						userSelect: 'none',
						height: '100%',
						color: '#1677ff',
						backgroundColor: 'rgba(22,119,255,.01)',
						borderRadius: '20px',
						boxShadow: '0 0 20px rgba(22,119,255,.01)',
						...flexCenter,
					} }>
						<div style={ { flexDirection: 'column', ...flexCenter } }>
							<img width="80px" src={ spinner } alt="spinner"/>
							<div>正在加载草稿数据</div>
						</div>
					</div>
			}
		</div>
	);
};

export default MarkdownEditor;
