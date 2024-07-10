import { SafeAreaView } from 'react-native-safe-area-context';
import { useStatsStore } from '../store/stats';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Text, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { PlayHeader } from '../components/headers';
import { useGame } from '../hooks/useGame';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import Animated, {
	FadeIn,
	FadeOut,
	useSharedValue,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayButtonBoard } from '../components/buttons';
import { BlurView } from 'expo-blur';
import { ImageInfoModal } from '../components/modals';
import { usePlayTimer } from '../hooks/useTimer';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const PlayPage = () => {
	const { currentImg, correct, incorrect, loading, isAnswered, onChoiceSelect, onContinue } =
		useGame();
	const [disabled, setDisabled] = useState(true);
	const [isInfoVis, setIsInfoVis] = useState(false);
	const [containerHeight, setContainerHeight] = useState(0);
	const { height } = useWindowDimensions();
	const { top } = useSafeAreaInsets();
	const { seconds, stopTimer, toggleTimer } = usePlayTimer();

	return (
		<>
			{currentImg && (
				<View style={{ position: 'absolute', width: '100%', height: height + top }}>
					<Image
						source={{ uri: currentImg.file_url }}
						style={{
							width: '100%',
							height: '100%',
						}}
						transition={{ effect: 'curl-down', duration: 1100 }}
						contentFit="cover"
						cachePolicy={'none'}
						blurRadius={20}
					/>
					<LinearGradient
						colors={['rgba(0,0,0,0.9)', 'transparent', 'rgba(0,0,0,0.9)']}
						locations={[0.0, 0.5, 1]}
						style={{ position: 'absolute', height: '100%', width: '100%' }}
					/>
				</View>
			)}
			<SafeAreaView style={{ flex: 1 }}>
				<PlayHeader
					correct={correct}
					incorrect={incorrect}
					seconds={seconds}
					stopTimer={stopTimer}
				/>
				<View
					onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					{loading && <ActivityIndicator />}
					{!loading && currentImg && (
						<>
							<Image
								source={{ uri: currentImg.file_url }}
								style={{
									width: '100%',
									height: containerHeight > 0 ? containerHeight * 0.75 : 400,
								}}
								onLoad={() => {
									setDisabled(false);
									toggleTimer();
								}}
								onLoadStart={() => setDisabled(true)}
								onError={(e) => {
									onContinue();
								}}
								transition={{ effect: 'curl-down', duration: 1100 }}
								contentFit="contain"
								cachePolicy={'none'}
							/>
						</>
					)}
				</View>
				<PlayButtonBoard
					isAnswered={isAnswered}
					onChoiceSelect={onChoiceSelect}
					onContinue={onContinue}
					onInfoSelect={() => setIsInfoVis(true)}
					correctAnswer={currentImg?.isAI ? 'ai' : 'real'}
					onQuit={() => {
						stopTimer();
						router.back();
					}}
					disabled={disabled}
				/>

				{currentImg && (
					<ImageInfoModal
						imageData={currentImg}
						onDismiss={() => setIsInfoVis(false)}
						visible={isInfoVis}
					/>
				)}
			</SafeAreaView>
		</>
	);
};

export default PlayPage;
