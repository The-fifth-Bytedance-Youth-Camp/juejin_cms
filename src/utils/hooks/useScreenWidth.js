import { useState, useEffect } from 'react';

function useScreenWidth() {
	const [ width, setWidth ] = useState(0);

	useEffect(() => {
		const handleResize = () => setWidth(window.innerWidth);
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return width;
}

export default useScreenWidth;
