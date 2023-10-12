import axios from "axios";
import { AIBOORU_URL } from "../../constants";
import { ImageFetchParams } from "./types";

const AiAPI = axios.create({baseURL: AIBOORU_URL})

type FakeImageParams = {
    params: ImageFetchParams;
}
export const getFakeImage = async({params}:FakeImageParams) => {
      const response = await AiAPI.get('/posts.json', {data: params});
      console.log(response.data);
}