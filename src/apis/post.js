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
	insertPostCache({ title, category, cover, content, tags, theme, codeStyle }) {
		return request.post('/cache/insert', { title, category, cover, content, tags, theme, codeStyle });
	},
	getPostCache() {
		return request.get('/cache');
	},
	uploadImage(file) {
		const data = new FormData();
		data.append('file', file, file?.name);
		return request.post('/upload/image', data);
	},
};
