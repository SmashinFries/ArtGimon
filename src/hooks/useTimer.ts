import { useCallback, useEffect, useState } from 'react';
import { useStatsStore } from '../store/stats';

export const usePlayTimer = () => {
	const [seconds, setSeconds] = useState(0);
	const [isStopped, setIsStopped] = useState(false);
	const { increaseStat, addTotalTime } = useStatsStore();

	const toggleTimer = (pause: boolean = false) => {
		setIsStopped(pause);
	};

	const stopTimer = useCallback(() => {
		setIsStopped(true);
		increaseStat('total_sessions');
		addTotalTime(seconds);
	}, [seconds]);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;
		if (!isStopped) {
			interval = setInterval(() => {
				setSeconds((seconds) => seconds + 1);
			}, 1000);
		} else if (isStopped && seconds !== 0) {
			interval && clearInterval(interval);
		}
		return () => {
			interval && clearInterval(interval);
		};
	}, [isStopped]);

	return { seconds, toggleTimer, stopTimer };
};
