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
	insertPostCache(content) {
		return request.post('/cache/insert', { content });
	},
	getPostCache() {
		return request.get('/cache');
	},
};
