import { useCallback, useEffect, useState } from 'react';
import { getFakeImage, getRealImage } from '../../api/api';
import { UnifiedBooruPost } from '../../api/types';
import { processAIPosts, processGelPosts, shufflePosts } from '../../utils/arrays';
import { AiParams } from '../../types/types';
import { getAIParams } from '../../utils/exif';

export const useEndless = () => {
    const [loading, setLoading] = useState(true);
    const [shuffledImages, setShuffledImages] = useState<UnifiedBooruPost[]>([]);
    const [currentImage, setCurrentImage] = useState<UnifiedBooruPost>();
    const [answer, setAnswer] = useState<'ai' | 'real' | 'none'>();
    const [isCorrect, setIsCorrect] = useState<boolean>();
    const [isCompleted, setIsCompleted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);
    const [page, setPage] = useState(0);
    const [aiParams, setAiParams] = useState<AiParams>({});

    const handleCorrect = () => {
        setCorrect(correct + 1);
    };

    const handleIncorrect = () => {
        setIncorrect(incorrect + 1);
    };

    const getRandomImage = useCallback(
        async (initialPage?: number) => {
            setLoading(true);
            if (shuffledImages.length < 1) {
                console.log('Fetching new images');
                const results = await fetchImages(initialPage ?? page + 1);
                const selectedImage = results[results.length - 1];
                setPage((prev) => prev + 1);
                setCurrentImage(selectedImage);
                setShuffledImages((prev) =>
                    prev.filter((image) => image.weblink !== selectedImage?.weblink),
                );
                setIsCompleted(false);
                setIsCorrect(undefined);
                setAnswer(selectedImage?.isAI ? 'ai' : 'real');
                setAiParams(await getAIParams(selectedImage.file_url));
            } else {
                const images = [...shuffledImages];
                const selectedImage = images[images.length - 1];
                setCurrentImage(selectedImage);
                setIsCompleted(false);
                setIsCorrect(undefined);
                setAnswer(selectedImage?.isAI ? 'ai' : 'real');
                setShuffledImages((prev) =>
                    prev.filter((image) => image.weblink !== selectedImage?.weblink),
                );
                setAiParams(await getAIParams(selectedImage.file_url));
            }
            setLoading(false);
        },
        [shuffledImages],
    );

    const fetchImages = async (page = 0) => {
        setLoading(true);
        const aiResults = await getFakeImage({
            limit: 50,
            page: page,
            tags: '-animated 1girl order:random rating:g age:<6month',
        });
        const realResults = await getRealImage({
            limit: 50,
            pid: page,
            tags: '-ai_assisted -animated 1girl solo rating:g',
        });

        if (aiResults?.length > 0 && realResults?.length > 0) {
            const shuffledResults = shufflePosts([
                ...processAIPosts(aiResults),
                ...processGelPosts(realResults),
            ]);
            setShuffledImages(shuffledResults);
            setLoading(false);
            return shuffledResults;
        } else {
            setLoading(false);
            return [];
        }
    };

    const onSelect = (choice: 'ai' | 'real' | 'none') => {
        if (choice === answer) {
            handleCorrect();
            setIsCorrect(true);
        } else {
            handleIncorrect();
            setIsCorrect(false);
        }
        setIsCompleted(true);
        // getRandomImage();
    };

    useEffect(() => {
        if (!currentImage) {
            getRandomImage(0);
        }
    }, []);

    return {
        currentImage,
        correct,
        incorrect,
        answer,
        onSelect,
        getRandomImage,
        isCorrect,
        isCompleted,
        loading,
        aiParams,
    };
};
