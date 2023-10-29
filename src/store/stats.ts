import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UnifiedBooruPost } from "../api/types";

type GameHighScore = {
    correct: number;
    incorrect: number;
    ratio: number;
}

type GameImage = UnifiedBooruPost & {
    user_answer: 'ai' | 'real'
};

type GameModeSession = GameHighScore & {
    session_length: number;
    end_date: string;
    images: GameImage[];
}

type GameModesStats = {
    sessions: GameModeSession[];
    highscore?: GameHighScore;
    last_played?: string;
    sessions_played?: number;
}

type StatsState = {
    endless: GameModesStats;
};

type StatsAction = {
    updateEndless: (stats:GameModesStats) => void;
    // toggleShowNSFW: (mode: SettingsState['showNSFW']) => void;
};

export const useStatsStore = create<StatsState & StatsAction>()(
    persist(
        (set, get) => ({
            endless: get()?.endless ?? {
                sessions: [],
                highscore: {
                    correct: 0,
                    incorrect: 0,
                    ratio: 0,
                },
                last_played: '',
                sessions_played: 0,
            },
            updateEndless: (stats) => set(() => ({ endless: { ...get().endless, ...stats, sessions: [...get().endless.sessions, ...stats.sessions] } })),
        }),
        {
            name: 'stats-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);