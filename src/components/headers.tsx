import { Appbar, Divider, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
    SharedValue,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const EndlessHeader = () => {
    return (
        <Appbar.Header mode="medium">
            <Appbar.BackAction onPress={() => router.replace('/')} />
            {/* <Appbar.Action icon="magnify" />
            <Appbar.Action icon="dots-vertical" /> */}
        </Appbar.Header>
    );
};

type GameStateHeaderProps = {
    isCompleted: boolean;
    isCorrect: boolean | undefined;
    answer: string;
    correct: number;
    incorrect: number;
};
export const GameStateHeader = ({
    isCompleted,
    answer,
    isCorrect,
    correct,
    incorrect,
}: GameStateHeaderProps) => {
    const correctScale = useSharedValue(0);
    const incorrectScale = useSharedValue(0);
    const answerScale = useSharedValue(0);
    const { colors } = useTheme();

    const correctAnimStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: correctScale.value }],
        };
    });

    const correctTextAnimStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(correctScale.value, [0, 1.2], ['green', colors.onBackground]),
        };
    });

    const incorrectAnimStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: incorrectScale.value }],
        };
    });

    const incorrectTextAnimStyle = useAnimatedStyle(() => {
        return {
            color: interpolateColor(incorrectScale.value, [0, 1.2], ['red', colors.onBackground]),
        };
    });

    const answerAnimStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: answerScale.value }],
        };
    });

    const animateCorrect = () => {
        correctScale.value = withTiming(1.2, { duration: 600 });
    };

    const animateIncorrect = () => {
        incorrectScale.value = withTiming(1.2, { duration: 600 });
    };

    // useEffect(() => {
    //     if (isCompleted) {
    //         animateCorrect();
    //     }
    // },[isCompleted, correct]);

    // useEffect(() => {
    //     if (isCompleted) {
    //         animateIncorrect();
    //     }
    // },[isCompleted, incorrect]);

    useEffect(() => {
        if (isCompleted) {
            if (isCorrect) {
                animateCorrect();
            } else {
                animateIncorrect();
            }
            answerScale.value = withTiming(1, { duration: 400 });
        } else {
            correctScale.value = withTiming(0);
            incorrectScale.value = withTiming(0);
            answerScale.value = withTiming(0);
        }
    }, [isCorrect, isCompleted]);

    // useEffect(() => {
    //     if (!isCompleted) {
    //         correctScale.value = withTiming(0);
    //         incorrectScale.value = withTiming(0);
    //     }
    // },[isCompleted])

    return (
        <Animated.View style={[{ width: '100%' }]}>
            <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <View style={{ justifyContent: 'center', overflow: 'visible' }}>
                    <Animated.View
                        style={[
                            correctAnimStyle,
                            {
                                height: 50,
                                width: 50,
                                position: 'absolute',
                                borderRadius: 100,
                                alignSelf: 'center',
                                backgroundColor: 'green',
                            },
                        ]}
                    />
                    <Animated.Text
                        style={[correctTextAnimStyle, { fontWeight: '900', fontSize: 28 }]}
                    >
                        {correct}
                    </Animated.Text>
                </View>
                <Text>|</Text>
                <View>
                    {/* <Text style={{fontWeight:'900', color:'red'}} variant="titleLarge">{incorrect}</Text> */}
                    <Animated.View
                        style={[
                            incorrectAnimStyle,
                            {
                                height: 50,
                                width: 50,
                                position: 'absolute',
                                borderRadius: 100,
                                alignSelf: 'center',
                                backgroundColor: 'red',
                            },
                        ]}
                    />
                    <Animated.Text
                        style={[incorrectTextAnimStyle, { fontWeight: '900', fontSize: 28 }]}
                    >
                        {incorrect}
                    </Animated.Text>
                </View>
            </View>
            <Text style={{ textAlign: 'center' }}>
                {correct && incorrect
                    ? (correct / incorrect).toFixed(2)
                    : correct ?? '-' + incorrect}
            </Text>
            <Animated.Text
                style={[
                    answerAnimStyle,
                    {
                        fontWeight: 'bold',
                        color: isCorrect ? 'green' : 'red',
                        fontSize: 30,
                        textAlign: 'center',
                    },
                ]}
            >
                {isCompleted ? 'Its ' + (answer === 'ai' ? 'AI' : 'Real') + '!' : ''}
            </Animated.Text>
            <Divider style={{ marginVertical: 20, width: '90%', alignSelf: 'center' }} />
        </Animated.View>
    );
};
