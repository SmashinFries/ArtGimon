export type GelImageFetchParams = {
    pid?: number;
    limit?: number;
    tags: string;
};

export type GelTags = {
    type: string;
    label: string;
    value: string;
    category: number;
    post_count: number;
};

export enum GelbooruRating {
    General = 'g',
    Sensitive = 's',
    Questionable = 'q',
    Explicit = 'e',
}

export type GelPost = {
    id: number;
    created_at: string;
    score: number;
    width: number;
    height: number;
    md5: string;
    directory: string;
    image: string;
    rating: 'general' | 'sensitive' | 'questionable' | 'explicit';
    source: string;
    change: number;
    owner: string;
    creator_id: number;
    parent_id: number;
    sample: number;
    preview_height: number;
    preview_width: number;
    tags: string;
    title: string;
    has_notes: string;
    has_comments: string;
    file_url: string;
    preview_url: string;
    sample_url: string;
    sample_width: number;
    sample_height: number;
    status: string;
    post_locked: number;
    has_children: string;
};

export type GelPostResponse = {
    '@attributes': {
        limit: number;
        offset: number;
        count: number;
    };
    post: GelPost[];
};

export type MediaAsset = {
    id: number;
    created_at: Date;
    updated_at: Date;
    md5: string;
    file_ext: string;
    file_size: number;
    image_width: number;
    image_height: number;
    duration: null;
    status: string;
    file_key: string;
    is_public: boolean;
    pixel_hash: string;
    variants: Variant[];
};

export type Variant = {
    type: string;
    url: string;
    width: number;
    height: number;
    file_ext: string;
};

export type GelArtistCommentary = {
    id: number;
    post_id: number;
    original_title: string;
    original_description: string;
    translated_title: string;
    translated_description: string;
    created_at: string;
    updated_at: string;
}[];
export type GelArtistCommentaryParams = {
    'search[post_id]': number;
};

export type GelWikiPage = {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    body: string;
    is_locked: boolean;
    other_names: string[];
    is_deleted: boolean;
};

export type GelRatings = 'g' | 's' | 'q' | 'e';

export type AIImageFetchParams = {
    page?: number;
    limit?: number;
    tags: string;
};

export type AIbooruPost = {
    id: number;
    created_at: string;
    updated_at: string;
    up_score: number;
    down_score: number;
    score: number;
    source: string;
    md5: string;
    rating: GelRatings;
    is_pending: boolean;
    is_flagged: boolean;
    is_deleted: boolean;
    uploader_id: number;
    approver_id: number;
    last_noted_at: null;
    last_comment_bumped_at: null;
    fav_count: number;
    tag_string: string;
    tag_count: number;
    tag_count_general: number;
    tag_count_artist: number;
    tag_count_character: number;
    tag_count_copyright: number;
    file_ext: string;
    file_size: number;
    image_width: number;
    image_height: number;
    parent_id: number;
    has_children: boolean;
    is_banned: boolean;
    pixiv_id: null;
    last_commented_at: null;
    has_active_children: boolean;
    bit_flags: number;
    tag_count_meta: number;
    tag_count_model: number;
    views: number;
    has_large: boolean;
    has_visible_children: boolean;
    tag_string_general: string;
    tag_string_character: string;
    tag_string_copyright: string;
    tag_string_artist: string;
    tag_string_meta: string;
    tag_string_model: string;
    file_url: string;
    large_file_url: string;
    preview_file_url: string;
};

export type UnifiedBooruPost = {
    id: number;
    created_at: string;
    score: number;
    source: string;
    file_url: string;
    preview_file_url: string;
    width: number;
    height: number;
    tags: string;
    isAI: boolean;
    weblink: string;
};

export const isGelbooru = (x: object): x is GelPost => x.hasOwnProperty('height');
