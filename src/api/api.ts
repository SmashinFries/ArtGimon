import axios from "axios";
import { AIBOORU_URL, DANBOORU_URL } from "../../constants";
import { DanPost, ImageFetchParams } from "./types";

const AiAPI = axios.create({baseURL: AIBOORU_URL});
const DanAPI = axios.create({baseURL: DANBOORU_URL});

export const getFakeImage = async(params:ImageFetchParams) => {
    try {
        const response = await AiAPI.get<DanPost[]>('/posts.json', {params:params});
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getRealImage = async(params:ImageFetchParams) => {
    try {
        const response = await DanAPI.get<DanPost[]>('/posts.json', {params:params});
        return response.data;
    } catch (error) {
        console.log(error);
    }
      
}