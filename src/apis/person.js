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
	searchSuperInfo(id) {
		return request.get('/admin/search',{
			params: { id },
		});
	},
	searchCommonInfo(id) {
		return request.get('/user/search',{
			params: { id },
		});
	},
	deleteAdmin(id) {
		return request.post('/admin/delete', { id });
	},
	deleteCommon(id) {
		return request.post('/user/delete', { id });
	},
	insertAdmin({ name,email,password }){
		return request.post('/admin/insert', {
			name,
			email,
			password,
		});
	},
	insertCommon({ name,email,password }){
		return request.post('/user/insert', {
			name,
			email,
			password,
		});
	},
	updateAdmin({ id,name,email,password }){
		return request.post('/admin/update', {
			id,
			name,
			email,
			password,
		});
	},
	updateCommon({ id,name,email,password }){
		return request.post('/user/update', {
			id,
			name,
			email,
			password,
		});
	},
};
