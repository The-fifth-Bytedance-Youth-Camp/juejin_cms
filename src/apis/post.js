import axios from 'axios';

const request = axios.create({
	baseURL: 'http://localhost:3100',
	headers: {
		Authorization: 'Bearer ' + (() => localStorage.getItem('token'))(),
		DownLink: (() => navigator.connection?.effectiveType.toLowerCase())(),
	},
});

export const postApi = {
	searchCategory(keyword = '') {
		return request.get('/category/search', {
			params: { keyword },
		});
	},
	searchTag(keyword = '') {
		return request.get('/tag/search', {
			params: { keyword },
		});
	},
	searchTheme(keyword = '') {
		return request.get('/theme/search', {
			params: { keyword },
		});
	},
	searchCodeStyle(keyword = '') {
		return request.get('/codeStyle/search', {
			params: { keyword },
		});
	},
	insertPostCache({ title, category, cover, content, tags, theme, codeStyle: code_style }) {
		return request.post('/cache/insert', { title, category, cover, content, tags, theme, code_style });
	},
	getPostCache() {
		return request.get('/cache');
	},
	uploadImage(file) {
		const data = new FormData();
		data.append('file', file, file?.name);
		return request.post('/upload/image', data);
	},
	insertPost({ title, brief, content, cover, category, tags, images, theme, codeStyle: code_style }) {
		return request.post('/post/insert', {
			title,
			brief,
			content,
			cover,
			category,
			tags,
			images,
			theme,
			code_style,
		});
	},
	searchPost({ title, category, tags, state, endTime, startTime, current: page, pageSize: rows }) {
		return request.get('/post/search', {
			params: { title, category, tags, state, endTime, startTime, page, rows },
		});
	},
	findPostTags(id) {
		return request.get('/post/find/tag', {
			params: { id },
		});
	},
	deletePost(id) {
		return request.post('/post/delete', { id });
	},
	findPostByState(state) {
		return request.get('/post/find/state', {
			params: { state, page: 1, rows: 40 },
		});
	},
	finPostById(id) {
		return request.get('/post/find', {
			params: { id },
		});
	},
};
