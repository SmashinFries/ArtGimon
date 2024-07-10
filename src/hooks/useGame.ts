import { useCallback, useEffect, useState } from 'react';
import { useStatsStore } from '../store/stats';
import { fetchAIImages, fetchRealImages } from '../api/api';
import { processAIPosts, processGelPosts, shufflePosts } from '../utils/arrays';
import { UnifiedBooruPost } from '../api/types';

const gel_tags = 'rating:general sort:random:431';
const ai_tags = 'rating:general random:50';

export const useGame = () => {
	const { increaseStat } = useStatsStore();
	const [correct, setCorrect] = useState<number>(0);
	const [incorrect, setIncorrect] = useState<number>(0);
	const [imageset, setImageset] = useState<UnifiedBooruPost[]>();
	const [currentImg, setCurrentImg] = useState<UnifiedBooruPost>();
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [isAnswered, setIsAnswered] = useState(false);

	const getImageSet = async (page = 1) => {
		const ai = await fetchAIImages({ tags: ai_tags });
		const real = await fetchRealImages({ tags: gel_tags, limit: 50, pid: page });
		const shuffledImages = shufflePosts([...processAIPosts(ai), ...processGelPosts(real)]);
		setImageset(shuffledImages);
		setCurrentImg(shuffledImages[0]);
		setLoading(false);
	};

	const onChoiceSelect = useCallback(
		(isAI: boolean) => {
			if (!imageset) {
				return;
			}
			if (isAI === currentImg?.isAI) {
				increaseStat(currentImg.isAI ? 'correct_ai' : 'correct_real');
				setCorrect((prev) => prev + 1);
			} else if (currentImg) {
				increaseStat(currentImg.isAI ? 'incorrect_ai' : 'incorrect_real');
				setIncorrect((prev) => prev + 1);
			}
			increaseStat('images_seen');
			setIsAnswered(true);
		},
		[correct, incorrect, currentImg, imageset],
	);

	const onContinue = useCallback(() => {
		if (imageset) {
			setCurrentImg(imageset[(correct + incorrect) % 100]);
			setIsAnswered(false);
		}
	}, [imageset, correct, incorrect]);

	useEffect(() => {
		if ((correct > 0 || incorrect > 0) && imageset) {
			if (correct + incorrect === page * 100) {
				setPage((prev) => prev + 1);
				getImageSet(page + 1);
			}
		}
	}, [correct, incorrect, imageset]);

	useEffect(() => {
		getImageSet();
	}, []);

	return {
		currentImg,
		correct,
		incorrect,
		loading,
		isAnswered,
		onChoiceSelect,
		onContinue,
	};
};
