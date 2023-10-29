import { Image } from 'expo-image';
import { ScrollView, View, useWindowDimensions } from 'react-native';
import { useEndless } from '../../hooks/game/useEndless';
import { ActivityIndicator, Button, IconButton, List, Text, useTheme } from 'react-native-paper';
import { useEffect, useMemo, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { EndlessHeader, GameStateHeader } from '../../components/headers';
import Animated, {
    FadeIn,
    FadeOut,
    interpolate,
    interpolateColor,
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

const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const EndlessGame = () => {
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const {
        currentImage,
        correct,
        incorrect,
        getRandomImage,
        answer,
        isCorrect,
        isCompleted,
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
    const [imageWidth, setImageWidth] = useState(0);

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

    useEffect(() => {
        if (!isCompleted && answerChoice.value !== 'none') {
            onSelect(answerChoice.value);
        }
    }, [answerChoice.value, isCompleted]);

    return (
        <SafeAreaView style={{ alignItems: 'center', height: '100%' }}>
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
                                    onLayout={(e) => setImageWidth(e.nativeEvent.layout.width)}
                                    resizeMode={'cover'}
                                    progressiveRenderingEnabled={true}
                                    onLoadStart={() => setLoading(true)}
                                    onLoadEnd={() => setLoading(false)}
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

                                {/* {isCompleted && <Animated.View entering={FadeIn} exiting={FadeOut} style={{alignSelf:'center', position:'absolute',  justifyContent:'center', width:'100%', height:'auto', aspectRatio:ar, borderRadius:12, backgroundColor:isCorrect ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0,0.4)'}}>
                                <IconButton style={{alignSelf:'center', backgroundColor:'rgba(0,0,0,0.6)',}} iconColor={answerChoice.value === answer ? "green" : "red"} size={48} icon={answerChoice.value === answer ? 'check' : 'close'} />
                                <Text variant="titleLarge" style={{color:'#FFF', textAlign:'center'}}>It's {answer === 'ai' ? 'AI' : 'Real'} !</Text>
                            </Animated.View>} */}
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
                                                transform: [{ rotate: '90deg' }],
                                                alignItems: 'center',
                                                left: imageWidth,
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
                                                transform: [{ rotate: '90deg' }],
                                                alignItems: 'center',
                                                right: imageWidth,
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
                            isAnswered={answerChoice.value !== 'none'}
                        />
                        <List.Item
                            title={'Source'}
                            right={(props) => (
                                <Text style={[props.style, { color: props.color, width: '70%' }]}>
                                    {currentImage?.source}
                                </Text>
                            )}
                        />
                        <List.Item
                            title={'Score'}
                            right={(props) => (
                                <Text style={[props.style, { color: props.color, width: '70%' }]}>
                                    {currentImage?.score}
                                </Text>
                            )}
                        />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default EndlessGame;
