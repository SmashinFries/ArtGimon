import {
	BackHandler,
	Platform,
	PlatformOSType,
	ToastAndroid,
	useWindowDimensions,
	View,
} from 'react-native';
import { Button, IconButton, Text } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '../store/themes';
import { Image } from 'expo-image';
import { useMenuBackground } from '../hooks/useBackground';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
	FadeIn,
	FadeOut,
	interpolateColor,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MenuButton } from '../components/buttons';
import { useRef, useState } from 'react';
import { MenuBackground } from '../components/backgrounds';
import { AboutMenu, MainMenu, SettingsMenu, StatsMenu } from '../components/menu/sharedViews';
import { MenuSelection } from '../types/types';
import { FadeViewMemo } from '../components/animations';
import { router, useFocusEffect } from 'expo-router';

const RootPage = () => {
	const { darkMode } = useThemeStore();
	const [choiceSelection, setChoiceSelection] = useState<MenuSelection>('main-menu');
	const { width, height } = useWindowDimensions();
	const [isBGPaused, setIsBGPaused] = useState(false);

	const onChoiceSelect = (choice: MenuSelection) => {
		if (choice === 'play') {
			setIsBGPaused(true);
			router.push('/play');
		} else {
			setChoiceSelection(choice);
		}
	};

	const onBack = () => {
		onChoiceSelect('main-menu');
	};

	useFocusEffect(() => {
		setIsBGPaused(false);
	});

	return (
		<MenuBackground isBGPaused={isBGPaused}>
			<SafeAreaView
				style={{
					paddingVertical: 20,
					// flex: 1,
					width: width,
					paddingHorizontal: 20,
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				{choiceSelection === 'main-menu' && <MainMenu onChoiceSelect={onChoiceSelect} />}
				{choiceSelection === 'stats' && <StatsMenu onBack={onBack} />}
				{choiceSelection === 'settings' && <SettingsMenu onBack={onBack} />}
				{choiceSelection === 'about' && <AboutMenu onBack={onBack} />}
			</SafeAreaView>
		</MenuBackground>
	);
};

export default RootPage;
