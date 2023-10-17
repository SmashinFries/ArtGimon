export type ImageFetchParams = {
    limit: number;
    tags?: string;
}

export type DanTags = {
    type: string;
    label: string;
    value: string;
    category: number;
    post_count: number;
};

export enum DanbooruRating {
    General = 'g',
    Sensitive = 's',
    Questionable = 'q',
    Explicit = 'e',
}

export type DanPost = {
    id: number;
    created_at: Date;
    uploader_id: number;
    score: number;
    source: string;
    md5: string;
    last_comment_bumped_at: null;
    rating: DanbooruRating;
    image_width: number;
    image_height: number;
    tag_string: string;
    fav_count: number;
    file_ext: string;
    last_noted_at: null;
    parent_id: null;
    has_children: boolean;
    approver_id: null;
    tag_count_general: number;
    tag_count_artist: number;
    tag_count_character: number;
    tag_count_copyright: number;
    file_size: number;
    up_score: number;
    down_score: number;
    is_pending: boolean;
    is_flagged: boolean;
    is_deleted: boolean;
    tag_count: number;
    updated_at: Date;
    is_banned: boolean;
    pixiv_id: null;
    last_commented_at: Date;
    has_active_children: boolean;
    bit_flags: number;
    tag_count_meta: number;
    has_large: boolean;
    has_visible_children: boolean;
    media_asset: MediaAsset;
    tag_string_general: string;
    tag_string_character: string;
    tag_string_copyright: string;
    tag_string_artist: string;
    tag_string_meta: string;
    file_url: string;
    large_file_url: string;
    preview_file_url: string;
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

export type DanArtistCommentary = {
    id: number;
    post_id: number;
    original_title: string;
    original_description: string;
    translated_title: string;
    translated_description: string;
    created_at: string;
    updated_at: string;
}[];
export type DanArtistCommentaryParams = {
    'search[post_id]': number;
};

export type DanWikiPage = {
    id: number;
    created_at: string;
    updated_at: string;
    title: string;
    body: string;
    is_locked: boolean;
    other_names: string[];
    is_deleted: boolean;
};

export type DanRatings = 'g' | 's' | 'q' | 'e';