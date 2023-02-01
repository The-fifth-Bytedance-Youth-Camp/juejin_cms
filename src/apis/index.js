import axios from 'axios';

const request = axios.create({
	baseURL: 'http://localhost:4400',
	headers: {
		Authorization: 'Bearer ' + (() => localStorage.getItem('token'))(),
	},
});

export const api = {
	loginByPassword(name, password) {
		return request.post('/person/login/admin/password', {
			name,
			password,
		});
	},
	loginByToken() {
		return request.get('/person/admin/find');
	},
};
