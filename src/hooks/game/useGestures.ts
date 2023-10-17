import { Directions, Gesture } from "react-native-gesture-handler";
import { useWindowDimensions } from "react-native";
import { interpolate, interpolateColor, useAnimatedReaction, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useEffect, useState } from "react";

export const useImagePan = () => {
    const { width, } = useWindowDimensions();
    const isPressed = useSharedValue(false);
    const offset = useSharedValue({ x: 0, y: 0 });
    const start = useSharedValue({ x: 0, y: 0 });
    const isAnswered = useSharedValue(false);
    const answerChoice = useSharedValue<'none'|'real'|'ai'>('none');
    const showNext = useSharedValue(false);

    const fingerXpos = useSharedValue(width/2);

    // x location to trigger choice selection
    const ai_zone = width*0.25;
    const real_zone = width*0.75;

    const animatedImgStyle = useAnimatedStyle(() => {
        return {
            borderWidth: 3,
            borderColor: interpolateColor(fingerXpos.value, [ai_zone, width/2-width*.10, width/2, width/2+width*.10, real_zone], ['orange', 'transparent', 'transparent', 'transparent', 'rgb(0, 217, 255)'], 'RGB'),
        };
    });

    const animatedContainerStyle = useAnimatedStyle(() => {
        return {
            transform: [
            { translateX: offset.value.x },
            { translateY: offset.value.y },
            { scale: withSpring(isPressed.value ? 1.1 : 1) },
            ],
        };
    });

    // useAnimatedReaction(
    //     () => {
    //       return fingerXpos.value;
    //     },
    //     (currentValue, previousValue) => {
            
    //       if (currentValue <= width/2) {
    //         // do something ✨
    //         console.log('Choosing AI', currentValue);
    //       } else if (currentValue >= width/2) {
    //         // do something else ✨
    //         console.log('Choosing Real', currentValue);
    //       }
    //     }
    //   );

    const flingGesture = Gesture.Fling()
        .enabled(answerChoice.value !== 'none')
        .direction(Directions.RIGHT)
        .onEnd(() => {
            showNext.value = true;
        })


    const panGesture = Gesture.Pan().enabled(answerChoice.value === 'none')
        .onBegin((e) => {
            isPressed.value = true;
            fingerXpos.value = e.absoluteX;
        })
        .onUpdate((e) => {
            fingerXpos.value = e.absoluteX;
            offset.value = {
                x: e.translationX + start.value.x,
                y: e.translationY + start.value.y,
            };
        })
        .onEnd((e) => {
            start.value = {
                x: offset.value.x,
                y: offset.value.y,
            };
            fingerXpos.value = e.absoluteX;
        })
        .onFinalize(() => {
            if (isAnswered.value === false) {
                offset.value = withTiming({x:0, y:0}, {duration: 500});
                start.value = {x:0, y:0};
            }
            if (fingerXpos.value <= ai_zone) {
                answerChoice.value = 'ai';
            } else if (fingerXpos.value >= real_zone) {
                // onSelect('real');
                answerChoice.value = 'real';
            }
            fingerXpos.value = withTiming(width/2, {duration: 500});
            isPressed.value = false;
        });

    return {panGesture, flingGesture, showNext, isPressed, answerChoice, animatedImgStyle, animatedContainerStyle}
};