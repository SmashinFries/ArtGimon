import { useEffect, useState } from "react";
import { getFakeImage, getRealImage } from "../../api/api";
import { DanPost } from "../../api/types";
import { AIBOORU_URL, DANBOORU_URL } from "../../../constants";

export const useEndless = () => {
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState<DanPost>();
    const [weblink, setWeblink] = useState<string>('');
    const [answer, setAnswer] = useState<'ai'|'real'|'none'>();
    const [isCorrect, setIsCorrect] = useState<boolean>();
    const [isCompleted, setIsCompleted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [incorrect, setIncorrect] = useState(0);

    const handleCorrect = () => {
        setCorrect(correct + 1);
    };

    const handleIncorrect = () => {
        setIncorrect(incorrect + 1);
    };

    const getRandomImage = async () => {
        const randomNum = Math.random();
        setCurrentImage(undefined);
        setIsCompleted(false);
        setIsCorrect(undefined);
        setLoading(true);
        if (randomNum > 0.5) {
            const results = await getFakeImage({limit:1, tags:'1girl order:random rating:g,s age:<6month'});
            if (results) {
                setAnswer('ai');
                setCurrentImage(results[0]);
                setWeblink(AIBOORU_URL + '/posts/' + results[0].id)
                setLoading(false);
            }
        } else {
            const results = await getRealImage({limit:1, tags:'1girl order:random rating:g,s age:<6month'});
            if (results) {
                setAnswer('real');
                setCurrentImage(results[0]);
                setWeblink(DANBOORU_URL + '/posts/' + results[0].id)
                setLoading(false);
            }
        }
    };

    const onSelect = (choice:'ai'|'real'|'none') => {
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
            getRandomImage();
        }
        
    },[]);

    return {currentImage, correct, incorrect, answer, onSelect, getRandomImage, isCorrect, isCompleted, weblink}

};