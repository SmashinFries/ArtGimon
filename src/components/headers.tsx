import { Appbar, Divider, IconButton, Portal, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { BackHandler, Platform, View } from 'react-native';
import Animated, {
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withSequence,
	withSpring,
	withTiming,
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { QuitConfirmDialog } from './dialogs';
import { getHeaderTitle } from '@react-navigation/elements';
import { NativeStackHeaderProps } from '@react-navigation/native-stack/lib/typescript/src/types';
import { secToMinString } from '../utils/text';
import { IS_WEB } from '@/constants';

export const PaperHeader = ({ navigation, route, options, back }: NativeStackHeaderProps) => {
	const title = getHeaderTitle(options, route.name);
	return (
		<Appbar.Header>
			{back && <Appbar.BackAction onPress={navigation.goBack} />}
			<Appbar.Content title={title} />
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
	const [showQuitDialog, setShowQuitDialog] = useState(false);

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

	return (
		<Animated.View style={[{ width: '100%' }]}>
			<View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-evenly' }}>
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
						style={[correctTextAnimStyle, { fontWeight: '900', fontSize: 28 }]}>
						{correct}
					</Animated.Text>
				</View>
				<Text style={{ alignSelf: 'center' }}>|</Text>
				<View>
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
						style={[incorrectTextAnimStyle, { fontWeight: '900', fontSize: 28 }]}>
						{incorrect}
					</Animated.Text>
				</View>
			</View>
			<Text style={{ textAlign: 'center', width: '100%', alignSelf: 'center' }}>
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
				]}>
				{isCompleted ? 'Its ' + (answer === 'ai' ? 'AI' : 'Real') + '!' : ''}
			</Animated.Text>
			<Divider style={{ marginVertical: 20, width: '90%', alignSelf: 'center' }} />
			<IconButton
				icon={'close'}
				onPress={() => setShowQuitDialog(true)}
				style={{
					position: 'absolute',
					left: 10,
					top: 12,
					backgroundColor: colors.backdrop,
				}}
			/>
			<Portal>
				<QuitConfirmDialog
					visible={showQuitDialog}
					onDismiss={() => setShowQuitDialog(false)}
				/>
			</Portal>
		</Animated.View>
	);
};

type PlayHeaderProps = {
	correct: number;
	incorrect: number;
	seconds: number;
	stopTimer: () => void;
};
export const PlayHeader = ({ correct, incorrect, seconds, stopTimer }: PlayHeaderProps) => {
	const correct_scale = useSharedValue(1);
	const incorrect_scale = useSharedValue(1);
	const [contHeight, setContHeight] = useState(0);
	const [incorrectWidth, setIncorrectWidth] = useState(0);

	useEffect(() => {
		if (correct > 0) {
			correct_scale.value = withSequence(withSpring(1.2), withSpring(1));
		}
	}, [correct]);

	useEffect(() => {
		if (incorrect > 0) {
			incorrect_scale.value = withSequence(withSpring(1.2), withSpring(1));
		}
	}, [incorrect]);

	useEffect(() => {
		const backAction = () => {
			stopTimer();
			router.back();
			return true;
		};

		const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

		return () => backHandler.remove();
	}, []);

	return (
		<View
			onLayout={(e) => setContHeight(e.nativeEvent.layout.height)}
			style={[
				{ paddingHorizontal: 24, paddingTop: 20 },
				IS_WEB && { width: '70%', alignSelf: 'center' },
			]}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<Animated.View
					style={{
						alignItems: 'center',
						backgroundColor: 'rgba(0,0,0,0.5)',
						transform: [{ scale: correct_scale }],
						padding: 10,
						borderRadius: 12,
						width: incorrectWidth > 0 ? incorrectWidth : undefined,
					}}>
					<Text variant={IS_WEB ? 'headlineLarge' : 'titleLarge'}>Correct</Text>
					<Text
						variant={IS_WEB ? 'headlineSmall' : 'titleSmall'}
						style={{ color: 'green' }}>
						{correct}
					</Text>
				</Animated.View>
				<View style={{ justifyContent: 'center' }}>
					<Text variant={IS_WEB ? 'headlineSmall' : 'titleMedium'}>
						{secToMinString(seconds)}
					</Text>
				</View>
				<Animated.View
					onLayout={(e) => setIncorrectWidth(e.nativeEvent.layout.width)}
					style={{
						alignItems: 'center',
						backgroundColor: 'rgba(0,0,0,0.5)',
						transform: [{ scale: incorrect_scale }],
						padding: 10,
						borderRadius: 12,
					}}>
					<Text variant={IS_WEB ? 'headlineLarge' : 'titleLarge'}>Incorrect</Text>
					<Text
						variant={IS_WEB ? 'headlineSmall' : 'titleSmall'}
						style={{ color: 'red' }}>
						{incorrect}
					</Text>
				</Animated.View>
			</View>
		</View>
	);
};
