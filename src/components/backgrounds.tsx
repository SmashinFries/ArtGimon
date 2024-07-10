import Animated, {
	Extrapolation,
	FadeIn,
	FadeOut,
	interpolate,
	interpolateColor,
	useAnimatedProps,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useMenuBackground } from '../hooks/useBackground';
import { ReactNode, useMemo } from 'react';
import { Button, IconButton, Text } from 'react-native-paper';
import { BlurView, BlurViewProps } from 'expo-blur';
import { openBrowserAsync } from 'expo-web-browser';
import { DUMB_COMMENTARY } from '@/commentary';

const AnimBlurView = Animated.createAnimatedComponent(BlurView);

const MAX_BG_OPACITY = 0.6;
const BLUR_DURATION = 800;
const BLUR_INTESITY = 25;

type MenuBackgroundProps = {
	isBGPaused: boolean;
	children: ReactNode;
};
export const MenuBackground = ({ isBGPaused, children }: MenuBackgroundProps) => {
	const { currentImg, sourceUrl } = useMenuBackground(isBGPaused, true);
	const blurValue = useSharedValue(BLUR_INTESITY);
	const bgOpac = useSharedValue(MAX_BG_OPACITY);

	const comment = useMemo(
		() => DUMB_COMMENTARY[Math.floor(Math.random() * DUMB_COMMENTARY.length)],
		[],
	);

	const animatedProps = useAnimatedProps<BlurViewProps>(() => {
		return {
			intensity: interpolate(
				blurValue.value,
				[0, BLUR_INTESITY],
				[0, BLUR_INTESITY],
				Extrapolation.CLAMP,
			),
		};
	});

	const animatedBGStyle = useAnimatedStyle(
		() => ({
			backgroundColor: interpolateColor(
				bgOpac.value,
				[0, MAX_BG_OPACITY],
				['rgba(0,0,0,0)', `rgba(0,0,0,${MAX_BG_OPACITY})`],
				'RGB',
			),
		}),
		[],
	);

	const animatedChildStyle = useAnimatedStyle(
		() => ({
			opacity: interpolate(bgOpac.value, [0, MAX_BG_OPACITY], [0, 1]),
		}),
		[],
	);

	const onPressIn = () => {
		bgOpac.value = withTiming(0, { duration: BLUR_DURATION });
		blurValue.value = withTiming(0, { duration: BLUR_DURATION });
	};

	const onPressOut = () => {
		bgOpac.value = withTiming(0.6, { duration: BLUR_DURATION });
		blurValue.value = withTiming(BLUR_INTESITY, { duration: BLUR_DURATION });
	};

	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			{currentImg && (
				<Animated.View
					entering={FadeIn}
					exiting={FadeOut}
					style={{ position: 'absolute', height: '100%', width: '100%' }}>
					<Image
						source={currentImg}
						style={{ height: '100%', width: '100%' }}
						contentFit="cover"
						cachePolicy={'none'}
						transition={{ effect: 'cross-dissolve', duration: 1000 }}
					/>
					<Animated.View
						style={[
							animatedBGStyle,
							{ position: 'absolute', width: '100%', height: '100%' },
						]}
					/>
					<AnimBlurView
						style={[{ position: 'absolute', flex: 1, width: '100%', height: '100%' }]}
						tint={'systemThickMaterialDark'}
						// intensity={30}
						experimentalBlurMethod="dimezisBlurView"
						animatedProps={animatedProps}
					/>
				</Animated.View>
			)}
			<Animated.View style={[animatedChildStyle, { flex: 1 }]}>{children}</Animated.View>
			<Animated.View style={[animatedChildStyle]}>
				<Text style={[{ paddingHorizontal: 20 }]}>"{comment}"</Text>
			</Animated.View>
			<View
				style={{
					width: '100%',
					flexDirection: 'row',
					paddingHorizontal: 20,
					paddingBottom: 20,
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<Animated.View style={animatedChildStyle}>
					<Button onPress={() => sourceUrl && openBrowserAsync(sourceUrl)}>
						BG Source
					</Button>
				</Animated.View>
				<IconButton
					icon={'eye-outline'}
					onPressIn={onPressIn}
					onPressOut={onPressOut}
					style={{ alignSelf: 'flex-end', display: currentImg ? undefined : 'none' }}
				/>
			</View>
		</View>
	);
};

const menuBgStyle = StyleSheet.create({
	container: {
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
});
