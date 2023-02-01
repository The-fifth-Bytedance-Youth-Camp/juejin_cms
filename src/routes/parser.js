import React, { lazy } from 'react';

const NotFound = lazy(() => import('../pages/404'));

const flattenArray = (path, routes) => {
	const retArr = [];
	for (let { path: p, element, routes: r } of routes) {
		if (!element && !r) continue;
		if (!p.startsWith('/')) p = `${ path }/${ p }`;
		if (r) retArr.push(...flattenArray(p, r));
		retArr.push({ path: p, element });
	}
	return retArr;
};

export function parseRoutes(menuList) {
	const retList = [];
	for (let i = 0; i < menuList.length; i++) {
		let { path, element, routes } = menuList[i];
		if (routes) retList.push(...flattenArray(path, routes));
		if (!element) continue;
		retList.push({ path, element });
	}
	retList.push({
		path: '*',
		element: <NotFound/>,
	});
	// 打印路由表
	// console.table(retList.map(({ path }) => ({ path })));
	return retList;
}
