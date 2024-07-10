import axios from 'axios';
import { AIBOORU_URL } from '../../constants';
import {
	GelPost,
	GelImageFetchParams,
	AIbooruPost,
	AIImageFetchParams,
	GelPostResponse,
} from './types';
import { fetch, ResponseType } from '@tauri-apps/api/http';

const AiAPI = axios.create({ baseURL: AIBOORU_URL });

const fetchDesktop = async (params: GelImageFetchParams) => {
	const response = await fetch<GelPostResponse>(
		`https://gelbooru.com/index.php?page=dapi&s=post&q=index&pid=${params.pid}&limit=50&tags=${encodeURI(params.tags)}&json=1`,
		{
			method: 'GET',
			timeout: 30,
			responseType: ResponseType.JSON,
		},
	);
	return response;
};

export const fetchAIImages = async (params: AIImageFetchParams) => {
	try {
		// 4 tag limit
		const response = await AiAPI.get<AIbooruPost[]>('/posts.json', { params: params });
		if (response.data.length > 0) {
			return response.data;
		} else {
			return [];
		}
	} catch (error) {
		return [];
	}
};

export const fetchRealImages = async (params: GelImageFetchParams) => {
	const gelParams = {
		...params,
		json: 1,
		page: 'dapi',
		s: 'post',
		q: 'index',
		pid: 1,
	};
	try {
		const response = await fetchDesktop(gelParams);

		if (response.data.post.length > 0) {
			return response.data.post;
		} else {
			return [];
		}
	} catch (error) {
		return [];
	}
};

export const fetchBackground = async () => {
	const params = {
		json: 1,
		page: 'dapi',
		s: 'post',
		q: 'index',
		pid: 1,
		limit: 50,
		tags: 'rating:general width:>=1000 height:>1000 sort:random:3456 landscape 1girl',
	};
	try {
		const { data } = await fetchDesktop(params);
		if (data && data.post.length > 0) {
			data.post = data.post.filter(
				(post) => post.file_url.includes('png') || post.file_url.includes('jpg'),
			);
			return data;
		} else {
			return null;
		}
	} catch (err) {
		return null;
	}
};
