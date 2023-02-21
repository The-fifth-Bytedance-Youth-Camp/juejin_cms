import React from 'react';
import menu from '../config/menu';
import { parseRoutes } from './parser';
import AuditDetail from '../pages/Post/AuditDetail';

export default parseRoutes(menu,
	[
		{
			path: '/post/audit/:id',
			element: <AuditDetail/>,
		},
	]);
