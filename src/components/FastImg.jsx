import React, { useEffect, useState } from 'react';

const FastImg = ({ pid, alt, style, width, height }) => {
	const [ src, setSrc ] = useState('');

	useEffect(() => {
		const is4G = navigator.connection?.effectiveType.toLowerCase() === '4g';
		setSrc(`http://localhost:3100/uploads/${ is4G ? 'jpeg' : 'webp' }/${ pid }.${ is4G ? 'jpeg' : 'webp' }`);
	}, [ pid ]);

	return <img style={ style } width={ width } height={ height } src={ src } alt={ alt }/>;
};

export default FastImg;
