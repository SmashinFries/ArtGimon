// @ts-ignore
import ExifReader from 'exifreader/src/exif-reader.js'; //ts wack \0-0/
import { AiParams } from '../types/types';

export const getAIParams = async (url: string) => {
    if (!url.includes('aibooru')) return {};
    const result = await fetch(url);
    const arrayBuff = await result.arrayBuffer();
    const tags = ExifReader.load(arrayBuff);
    let aiParams: AiParams = {};
    if (tags?.parameters?.value) {
        const params: string = tags.parameters.value;
        const prompts = {
            prompt: params.split('\n')[0]?.trim() ?? '',
            neg_prompt: params.split('\n')[1]?.trim() ?? '',
        };
        aiParams = prompts;
        const imageParams = params.split('\n').at(-1)?.split('\n')[0]?.split(',');
        if (imageParams) {
            for (const field of imageParams) {
                // FIX: hash fields dont split properly
                const splitField = field.split(':');
                const key = splitField[0]?.trim();
                const value = splitField[1]?.trim();
                aiParams[key] = isNaN(Number(value))
                    ? value === 'True'
                        ? true
                        : value === 'False'
                        ? false
                        : value
                    : Number(value);
            }
        }
    }
    return aiParams;
};
