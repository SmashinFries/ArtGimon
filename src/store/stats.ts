import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StatsState = {
	total_sessions: number;
	time_spent: number; // in seconds!
	images_seen: number;
	incorrect_ai: number;
	incorrect_real: number;
	correct_ai: number;
	correct_real: number;
};

type StatsAction = {
	updateStats: ({ key, value }: { key: keyof StatsState; value: number }) => void;
	increaseStat: (key: keyof StatsState) => void;
	addTotalTime: (secs: number) => void;
	resetStats: () => void;
};

export const useStatsStore = create<StatsState & StatsAction>()(
	persist(
		(set, get) => ({
			total_sessions: 0,
			time_spent: 0,
			images_seen: 0,
			incorrect_ai: 0,
			incorrect_real: 0,
			correct_ai: 0,
			correct_real: 0,
			increaseStat: (key) => {
				set((state) => ({ [key]: state[key] + 1 }));
			},
			updateStats({ key, value }) {
				set({ [key]: value });
			},
			addTotalTime(secs) {
				set((state) => ({ time_spent: state.time_spent + secs }));
			},
			resetStats() {
				set({
					total_sessions: 0,
					time_spent: 0,
					incorrect_ai: 0,
					incorrect_real: 0,
					correct_ai: 0,
					correct_real: 0,
					images_seen: 0,
				});
			},
		}),
		{
			name: 'stats-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
