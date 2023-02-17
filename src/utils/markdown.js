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
import ReactDOMServer from 'react-dom/server';
import React from 'react';

const linkTarget = (md) => {
	const defaultRender = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};
	md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
		tokens[idx].attrPush([ 'target', '_blank' ]);
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
		let codeHtml = code.replaceAll('\t', '  ');
		try {
			if (hljs.getLanguage(language)) {
				codeHtml = hljs.highlight(codeHtml, { language }).value;
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

export const mdParser = new MarkdownIt({
	linkify: true,
	typographer: true,
})
	.use(emoji)
	.use(subscript)
	.use(superscript)
	.use(footnote)
	.use(deflist)
	.use(abbreviation)
	.use(insert)
	.use(mark)
	.use(copyCode)
	.use(linkTarget)
	.use(tasklists, { enabled: true });
