import { AIBOORU_URL, GELBOORU_URL } from '../../constants';
import { AIbooruPost, GelPost, UnifiedBooruPost } from '../api/types';

export const shufflePosts = (array: UnifiedBooruPost[]) => {
    const results = array.sort(() => Math.random() - 0.5);
    // for (let i = array.length - 1; i > 0; i--) {
    //     const j = Math.floor(Math.random() * (i + 1));
    //     [results[i], results[j]] = [array[j], array[i]];
    // }
    return results;
};

export const processGelPosts = (gelposts: GelPost[]) => {
    const posts: UnifiedBooruPost[] = gelposts.map((post) => {
        return {
            id: post.id,
            created_at: post.created_at,
            file_url: post.file_url,
            height: post.height,
            image: post.file_url,
            preview_file_url: post.preview_url,
            score: post.score,
            source: post.source,
            tags: post.tags,
            width: post.width,
            weblink: GELBOORU_URL + '/index.php?page=post&s=view&id=' + post.id, // https://gelbooru.com/index.php?page=post&s=view&id=7783558
            isAI: false,
        };
    });

    return posts;
};

export const processAIPosts = (aiposts: AIbooruPost[]) => {
    const posts: UnifiedBooruPost[] = aiposts.map((post) => {
        return {
            id: post.id,
            created_at: post.created_at,
            file_url: post.file_url,
            height: post.image_height,
            width: post.image_width,
            source: post.source,
            tags: post.tag_string,
            score: post.score,
            preview_file_url: post.preview_file_url,
            weblink: AIBOORU_URL + '/posts/' + post.id,
            isAI: true,
        };
    });

    return posts;
};
