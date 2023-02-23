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
	searchSuperInfo(id,keyword) {
		return request.get('/admin/search',{
			params: { id,keyword },
		});
	},
	searchCommonInfo(id,keyword) {
		return request.get('/user/search',{
			params: { id,keyword },
		});
	},
	deleteAdmin(id) {
		return request.post('/admin/delete', { id });
	},
	deleteCommon(id) {
		return request.post('/user/delete', { id });
	},
	insertAdmin({ ad_name,ad_email,ad_password }){
		return request.post('/admin/insert', {
			name:ad_name,
			email:ad_email,
			password:ad_password,
		});
	},
	insertCommon({ ad_name,ad_email,ad_password }){
		return request.post('/user/insert', {
			name:ad_name,
			email:ad_email,
			password:ad_password,
		});
	},
	updateAdmin({ up_id,up_name,up_email,up_password }){
		return request.post('/admin/update', {
			id:up_id,
			name:up_name,
			email:up_email,
			password:up_password,
		});
	},
	updateCommon({ up_id,up_name,up_email,up_password }){
		return request.post('/user/update', {
			id:up_id,
			name:up_name,
			email:up_email,
			password:up_password,
		});
	},
	searchAllAdmin(){
		return request.get('/admin/searchall');
	},
	searchAllCommon(){
		return request.get('/user/searchall');
	},
};
