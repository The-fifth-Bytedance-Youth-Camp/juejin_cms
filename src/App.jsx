import React from 'react';
import Landing from './pages/Landing';
import Main from './pages/Main';

function App() {
	// 已登录
	if (localStorage.getItem('token')) return <Main/>;
	// 未登录
	return <Landing/>;
}

export default App;
