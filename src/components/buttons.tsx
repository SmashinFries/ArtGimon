import { IS_WEB } from '@/constants';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { Button, ButtonProps, IconButton, useTheme } from 'react-native-paper';
import Animated, {
	FadeIn,
	SlideInDown,
	SlideOutDown,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

type MenuButtonProps = ButtonProps & {};
export const MenuButton = (props: MenuButtonProps) => {
	const scale = useSharedValue<number>(1);

	const handlePressIn = () => {
		scale.value = withSpring(1.2);
	};

	const handlePressOut = () => {
		scale.value = withSpring(1);
	};

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
	}));

	return (
		<Animated.View style={[animatedStyles, IS_WEB && { flex: 1 }]}>
			<Button
				{...props}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				style={[props.style, { margin: 10 }]}>
				{props.children}
			</Button>
		</Animated.View>
	);
};

type PlayButtonBoardProps = {
	onChoiceSelect: (isAI: boolean) => void;
	onContinue: () => void;
	onInfoSelect: () => void;
	onQuit: () => void;
	isAnswered: boolean;
	correctAnswer: 'ai' | 'real';
	disabled?: boolean;
};
export const PlayButtonBoard = ({
	onChoiceSelect,
	onContinue,
	onInfoSelect,
	onQuit,
	isAnswered,
	correctAnswer,
	disabled,
}: PlayButtonBoardProps) => {
	const { colors } = useTheme();
	const [choice, setChoice] = useState<'ai' | 'real'>();

	const onAIPick = () => {
		onChoiceSelect(true);
		setChoice('ai');
	};

	const onRealPick = () => {
		onChoiceSelect(false);
		setChoice('real');
	};

	return (
		<View
			style={{
				width: '100%',
				alignItems: 'center',
				padding: 20,
			}}>
			{!isAnswered && (
				<Animated.View
					style={[
						{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-evenly',
						},
						IS_WEB && { minWidth: '70%' },
					]}
					entering={FadeIn}
					exiting={SlideOutDown}>
					<IconButton icon={'arrow-left'} onPress={onQuit} />
					<Button
						mode="contained"
						labelStyle={{ color: colors.onPrimaryContainer }}
						disabled={disabled}
						onPress={onAIPick}
						style={{
							flex: 1,
							marginHorizontal: 5,
							backgroundColor: colors.primaryContainer,
						}}>
						AI
					</Button>
					<Button
						mode="contained"
						labelStyle={{ color: colors.onSecondaryContainer }}
						disabled={disabled}
						onPress={onRealPick}
						style={{
							flex: 1,
							marginHorizontal: 5,
							backgroundColor: colors.secondaryContainer,
						}}>
						Real
					</Button>
				</Animated.View>
			)}
			{isAnswered && (
				<Animated.View
					style={[
						{
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							alignItems: 'center',
						},
						IS_WEB && { minWidth: '70%' },
					]}
					entering={SlideInDown}
					exiting={SlideOutDown}>
					<IconButton icon={'arrow-left'} onPress={onQuit} />
					<IconButton icon={'information'} onPress={onInfoSelect} />
					<Button
						mode="contained"
						icon={correctAnswer === choice ? 'check' : 'alert'}
						labelStyle={{ color: colors.onBackground }}
						disabled={disabled}
						onPress={onContinue}
						style={{
							flex: 1,
							marginHorizontal: 5,
							backgroundColor: correctAnswer === choice ? 'green' : 'red',
						}}>
						{`It's ${correctAnswer === 'ai' ? 'AI' : 'not AI'}!`}
					</Button>
				</Animated.View>
			)}
		</View>
	);
};
