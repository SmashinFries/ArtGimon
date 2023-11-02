import axios from 'axios';
import { AIBOORU_URL, GELBOORU_URL } from '../../constants';
import {
    GelPost,
    GelImageFetchParams,
    AIbooruPost,
    AIImageFetchParams,
    GelPostResponse,
} from './types';

const AiAPI = axios.create({ baseURL: AIBOORU_URL });
const DanAPI = axios.create({ baseURL: GELBOORU_URL });

export const getFakeImage = async (params: AIImageFetchParams) => {
    try {
        // 4 tag limit
        const response = await AiAPI.get<AIbooruPost[]>('/posts.json', { params: params });
        if (response.data.length > 0) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getRealImage = async (params: GelImageFetchParams) => {
    const gelParams = {
        ...params,
        json: 1,
        page: 'dapi',
        s: 'post',
        q: 'index',
        pid: 1,
    };
    try {
        // index.php?page=dapi&s=post&q=index&json=1&limit=100&pid=37&tags=-animated+1girl+solo+rating:g
        const response = await DanAPI.get<GelPostResponse>('/index.php', {
            params: gelParams,
            headers: { fringeBenefits: 'yup' },
        });

        if (response.data.post.length > 0) {
            return response.data.post;
        } else {
            return [];
        }
    } catch (error) {
        console.log(error);
        return [];
    }
};
