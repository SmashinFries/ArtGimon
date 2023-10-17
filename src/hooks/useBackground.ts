import { useEffect, useState } from "react";
import { getFakeImage, getRealImage } from "../api/api";



export const useMenuBackground = () => {
    const [images, setImages] = useState<string[]>([]);

    const loadImages = async() => {
        const firstBatch = await getFakeImage({limit: 25, tags: '1girl, order:random, rating:g,s, age:<6month'});
        const secondBatch = await getRealImage({limit: 25, tags: '1girl, order:random, rating:g,s, age:<6month'});
        if (firstBatch && secondBatch) {
            const firstBatchImages = firstBatch.map((post) => post);
            const secondBatchImages = secondBatch.map((post) => post);
            const combinedImages = [...firstBatchImages, ...secondBatchImages];

            // shuffle the images
            const shuffled = combinedImages.reduce(([a,b])=> (b.push(...a.splice(Math.random()*a.length|0, 1)), [a,b]),[[...combinedImages],[]])[1];
            
        }
        
    };

    useEffect(() => {
    },[]);
};