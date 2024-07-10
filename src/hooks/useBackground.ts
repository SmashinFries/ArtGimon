import { useEffect, useState } from 'react';
import { fetchBackground } from '../api/api';
import { GelPostResponse } from '../api/types';
import { GELBOORU_URL } from '@/constants';

export const useMenuBackground = (isBGPaused: boolean, enabled: boolean = true) => {
	const [images, setImages] = useState<GelPostResponse>();
	const [currentImg, setCurrentImg] = useState<string>();
	const [sourceUrl, setSourceUrl] = useState<string>();
	const [index, setIndex] = useState(0);

	const getBackgroundImages = async () => {
		setTimeout(() => null, 2000);
		const result = await fetchBackground();
		if (result) {
			result.post = result.post.filter((val) => val.file_url);
			setImages(result);
			setCurrentImg(result.post[0].file_url);
			setSourceUrl(result.post[0].source);
		}
	};

	useEffect(() => {
		if (images && index > 0) {
			setCurrentImg(images.post[index].file_url);
			setSourceUrl(GELBOORU_URL + '/index.php?page=post&s=view&id=' + images.post[index].id);
		}
	}, [index, images]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (images && !isBGPaused) {
			interval = setInterval(() => setIndex((prev) => (prev + 1) % 50), 20000);
		}
		if (isBGPaused) {
			interval && clearInterval(interval);
		}
		return () => {
			interval && clearInterval(interval);
		};
	}, [images, isBGPaused]);

	useEffect(() => {
		enabled && getBackgroundImages();
	}, []);

	return { currentImg, sourceUrl };
};
