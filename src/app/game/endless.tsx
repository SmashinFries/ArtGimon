import { Image } from 'expo-image';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useEndless } from '../../hooks/game/useEndless';
import {
    ActivityIndicator,
    Button,
    Chip,
    IconButton,
    List,
    Portal,
    Text,
    useTheme,
} from 'react-native-paper';
import { useEffect, useMemo, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { EndlessHeader, GameStateHeader } from '../../components/headers';
import Animated, {
    FadeIn,
    FadeOut,
    interpolate,
    interpolateColor,
    runOnJS,
    useAnimatedReaction,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useImagePan } from '../../hooks/game/useGestures';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionBar } from '../../components/actionBar';
import { isGelbooru } from '../../api/types';
import { Accordion } from '../../components/animations';

const EndlessGame = () => {
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const {
        currentImage,
        correct,
        incorrect,
        getRandomImage,
        answer,
        isCorrect,
        isCompleted,
        aiParams,
        loading,
        onSelect,
    } = useEndless();
    const {
        animatedContainerStyle,
        animatedAIChoiceStyle,
        animatedRealChoiceStyle,
        animatedImgStyle,
        answerChoice,
        panGesture,
        showNext,
    } = useImagePan();

    const [imageHeight, setImageHeight] = useState(0);

    // const ar = useMemo(() => (currentImage?.image_width ?? 1) / (currentImage?.image_height ?? 1),[currentImage?.image_width, currentImage?.image_height])
    const ar = useMemo(() => {
        if (currentImage && !isGelbooru(currentImage)) {
            return currentImage.width / currentImage.height;
        } else if (currentImage && 'height' in currentImage) {
            return currentImage.width / currentImage.height;
        } else {
            return 1;
        }
    }, [currentImage]);

    // useEffect(() => {
    //     console.log('choice:', answerChoice.value)
    //     if (showNext && answerChoice.value !== 'none') {
    //         console.log('Selecting');
    //         onSelect(answerChoice.value);
    //     }
    // }, [answerChoice, showNext]);

    useAnimatedReaction(
        () => {
            return answerChoice.value;
        },
        (currentValue, prevValue) => {
            if (currentValue !== 'none') {
                runOnJS(onSelect)(currentValue);
            }
        },
        [answer],
    );

    return (
        <SafeAreaView
            style={{ alignItems: 'center', height: '100%', backgroundColor: colors.background }}
        >
            <ScrollView
                scrollEnabled={isCompleted}
                contentContainerStyle={{
                    width: width,
                    height: isCompleted ? undefined : '100%',
                    overflow: 'visible',
                    alignItems: 'center',
                }}
            >
                <GameStateHeader
                    isCompleted={isCompleted}
                    answer={answer ?? 'none'}
                    isCorrect={isCorrect}
                    correct={correct}
                    incorrect={incorrect}
                />
                <View style={{ justifyContent: 'center' }}>
                    {currentImage ? (
                        <GestureDetector gesture={panGesture}>
                            <Animated.View
                                style={[
                                    animatedContainerStyle,
                                    {
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        aspectRatio: ar,
                                        marginVertical: 20,
                                        maxHeight: height - height * 0.35,
                                        height: 'auto',
                                        borderRadius: 12,
                                        width: '100%',
                                        maxWidth: width - width * 0.1,
                                    },
                                ]}
                            >
                                <Animated.Image
                                    onLayout={(e) => {
                                        setImageHeight(e.nativeEvent.layout.height);
                                    }}
                                    resizeMode={'cover'}
                                    progressiveRenderingEnabled={true}
                                    // onLoadStart={() => setLoading(true)}
                                    // onLoadEnd={() => setLoading(false)}
                                    source={{ uri: currentImage?.file_url }}
                                    style={[
                                        animatedImgStyle,
                                        {
                                            alignSelf: 'center',
                                            height: '100%',
                                            borderRadius: 12,
                                            width: '100%',
                                        },
                                    ]}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        height: '100%',
                                        width: '100%',
                                        top: 20,
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <Animated.View
                                        style={[
                                            animatedAIChoiceStyle,
                                            {
                                                position: 'absolute',
                                                borderRadius: 12,
                                                // transform: [{ rotate: '90deg' }],
                                                alignItems: 'center',
                                                bottom: imageHeight + 18,
                                                // left: imageWidth,
                                                right: 0,
                                            },
                                        ]}
                                    >
                                        <Text style={{ paddingHorizontal: 10 }}>AI</Text>
                                    </Animated.View>
                                    <Animated.View
                                        style={[
                                            animatedRealChoiceStyle,
                                            {
                                                position: 'absolute',
                                                borderRadius: 12,
                                                // transform: [{ rotate: '90deg' }],
                                                alignItems: 'center',
                                                // right: imageWidth,
                                                left: 0,
                                                bottom: imageHeight + 18,
                                            },
                                        ]}
                                    >
                                        <Text style={{ paddingHorizontal: 10 }}>Real</Text>
                                    </Animated.View>
                                </View>
                            </Animated.View>
                        </GestureDetector>
                    ) : (
                        <ActivityIndicator size={'large'} />
                    )}
                </View>
                {isCompleted && (
                    <View style={{ width: '100%', height: undefined }}>
                        <Button
                            mode="elevated"
                            style={{ marginHorizontal: 15 }}
                            onPress={() => {
                                answerChoice.value = 'none';
                                getRandomImage();
                            }}
                        >
                            Next
                        </Button>
                        {/* <Button onPress={() => console.log(imageHeight)}>Test</Button> */}
                        <ActionBar
                            sourceUrl={currentImage?.weblink ?? ''}
                            imgUrl={currentImage?.file_url ?? ''}
                            isAnswered={answerChoice.value !== 'none'}
                        />
                        {currentImage?.source && (
                            <List.Item
                                title={'Source'}
                                onPress={() => {
                                    WebBrowser.openBrowserAsync(currentImage?.source, {
                                        windowFeatures: { popup: false },
                                    });
                                }}
                                right={(props) => (
                                    <Text
                                        style={[props.style, { color: props.color, width: '70%' }]}
                                    >
                                        {currentImage?.source}
                                    </Text>
                                )}
                            />
                        )}
                        {Object.keys(aiParams)?.length > 0 && (
                            <Accordion title={'AI Parameters'}>
                                {Object.keys(aiParams)?.map((title, idx) => (
                                    <View key={idx}>
                                        <List.Item
                                            title={title}
                                            titleStyle={{ textTransform: 'capitalize' }}
                                        />
                                        <Text style={{ padding: 10, paddingLeft: 20 }}>
                                            {aiParams[title]}
                                        </Text>
                                    </View>
                                ))}
                            </Accordion>
                        )}

                        <Accordion title={'Tags'}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {currentImage?.tags.split(' ').map((tag, index) => (
                                    <Chip key={index} style={{ margin: 10 }}>
                                        {tag}
                                    </Chip>
                                ))}
                            </View>
                        </Accordion>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default EndlessGame;
