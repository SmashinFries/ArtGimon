import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavesPost = {
    id: number;
    image_url: string;
    rating: string;
}

type SavesState = {
    ai: SavesPost[];
    real: SavesPost[];
};

type SavesAction = {
    savePost: (type:'real'|'ai', post: SavesPost) => void;
};

// themes could be expanded more (custom themes) so its separated from the settings store
export const useSavesStore = create<SavesState & SavesAction>()(
    persist(
        (set, get) => ({
            ai: get().ai ?? [],
            real: get().real ?? [],
            savePost: (type, post) => type === 'ai' ? set(({ai}) => ({ ai: [post, ...ai] })) : set(({real}) => ({ real: [post, ...real] })),
        }),
        {
            name: 'saves-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
