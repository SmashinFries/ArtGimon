import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UnifiedBooruPost } from '../api/types';
import { Appearance } from 'react-native';

type ThemeState = {
    darkMode: boolean;
};

type ThemeAction = {
    toggleDarkMode: (mode: ThemeState['darkMode']) => void;
};

// themes could be expanded more (custom themes) so its separated from the settings store
export const useThemeStore = create<ThemeState & ThemeAction>()(
    persist(
        (set, get) => ({
            darkMode: get()?.darkMode ?? Appearance.getColorScheme() === 'dark' ? true : false,
            toggleDarkMode: (mode) => set(() => ({ darkMode: mode })),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
