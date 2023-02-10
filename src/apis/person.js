import axios from 'axios';

const request = axios.create({
	baseURL: 'http://localhost:3000',
	headers: {
		Authorization: 'Bearer ' + (() => localStorage.getItem('token'))(),
		DownLink: (() => navigator.connection?.effectiveType.toLowerCase())(),
	},
});

export const personApi = {
	loginByPassword(name, password) {
		return request.post('/login/admin/password', {
			name,
			password,
		});
	},
	loginByToken() {
		return request.get('/admin/find');
	},
};
