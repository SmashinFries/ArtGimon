import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Platform, Pressable, View } from 'react-native';
import { UnifiedBooruPost } from '../api/types';
import { Button } from 'react-native-paper';
import { MenuParent, StatItem } from './menu/sharedViews';
import { openBrowserAsync } from 'expo-web-browser';
import { BlurView } from 'expo-blur';
import { IS_WEB } from '@/constants';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

type ImageInfoModalProps = {
	visible: boolean;
	onDismiss: () => void;
	imageData: UnifiedBooruPost;
};
export const ImageInfoModal = ({ visible, imageData, onDismiss }: ImageInfoModalProps) => {
	const isWeb = IS_WEB;

	return (
		visible && (
			<View
				style={{
					flex: 1,
					position: 'absolute',
					width: '100%',
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<Animated.View
					entering={FadeIn.duration(500)}
					exiting={FadeOut.duration(500)}
					style={{
						position: 'absolute',
						overflow: 'hidden',
						height: '100%',
						width: '100%',
					}}>
					{/* onPress={() => setIsInfoVis(false)} */}
					<Pressable style={{ flex: 1, overflow: 'hidden' }} onPress={onDismiss}>
						<AnimatedBlurView
							style={{ width: '100%', height: '100%' }}
							intensity={60}
							experimentalBlurMethod="dimezisBlurView"
							tint={'systemMaterialDark'}
						/>
					</Pressable>
				</Animated.View>
				<Animated.View
					entering={SlideInDown.duration(isWeb ? 800 : 500)}
					exiting={SlideOutDown.duration(isWeb ? 800 : 500)}
					style={{
						width: IS_WEB ? '40%' : '90%',
						maxHeight: '90%',
						borderRadius: 12,
						backgroundColor: 'rgba(0,0,0,0.6)',
						justifyContent: 'space-between',
						alignItems: 'center',
						padding: IS_WEB ? 5 : 20,
					}}>
					<MenuParent title="Info" disableAnim={IS_WEB ? true : false} onBack={onDismiss}>
						<StatItem label="Size" value={`${imageData.width} x ${imageData.height}`} />
						<StatItem label="Score" value={imageData.score} />
						<StatItem label="AI" value={imageData.isAI ? 'True' : 'False'} />
						<Button
							style={{ marginTop: 20, width: '100%' }}
							mode="contained"
							onPress={() => openBrowserAsync(imageData.weblink)}>
							View Source
						</Button>
					</MenuParent>
					{/* <View
						style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end' }}>
						<Button onPress={onDismiss}>Close</Button>
					</View> */}
				</Animated.View>
			</View>
		)
	);
};
