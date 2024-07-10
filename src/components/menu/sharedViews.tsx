import { Platform, PlatformOSType, useWindowDimensions, View } from 'react-native';
import { MenuButton } from '../buttons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, Divider, IconButton, Text, TextProps, useTheme } from 'react-native-paper';
import { MenuSelection } from '@/src/types/types';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { useStatsStore } from '@/src/store/stats';
import { FadeViewMemo } from '../animations';
import { VariantProp } from 'react-native-paper/lib/typescript/components/Typography/types';
import { ReactNode } from 'react';
import { openBrowserAsync } from 'expo-web-browser';
import { IS_WEB } from '@/constants';

type MenuParentProps = {
	title: string;
	onBack: () => void;
	children: ReactNode;
	disableAnim?: boolean;
};
export const MenuParent = ({ title, disableAnim = false, onBack, children }: MenuParentProps) => {
	const { colors } = useTheme();
	return (
		<FadeViewMemo disableTransAnim={disableAnim} style={{ width: IS_WEB ? '50%' : '95%' }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
				<Text variant="headlineLarge">{title}</Text>
				<IconButton icon={'close-circle-outline'} onPress={onBack} />
			</View>
			<Divider
				style={{
					height: 3,
					width: '100%',
					alignSelf: 'center',
					backgroundColor: colors.onBackground,
					marginVertical: 10,
				}}
			/>
			<View
				style={{
					alignItems: 'flex-start',
					padding: 10,
				}}>
				{children}
			</View>
		</FadeViewMemo>
	);
};

type MenuProps = {
	onBack: () => void;
};

type MainMenuProps = {
	onChoiceSelect: (choice: MenuSelection) => void;
};
export const MainMenu = ({ onChoiceSelect }: MainMenuProps) => {
	return (
		<FadeViewMemo style={IS_WEB && { maxWidth: '60%', minWidth: '40%' }}>
			<View style={IS_WEB && { alignSelf: 'center' }}>
				<Text variant={'displayLarge'}>ArtGimon</Text>
				<Text variant="labelSmall">v1.0</Text>
			</View>
			<View>
				<MenuButton mode="contained" icon={'play'} onPress={() => onChoiceSelect('play')}>
					Play
				</MenuButton>
				<MenuButton
					icon={'chart-bar'}
					mode={'outlined'}
					onPress={() => onChoiceSelect('stats')}>
					Stats
				</MenuButton>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						alignItems: 'center',
					}}>
					<MenuButton
						icon={'cog-outline'}
						mode={'outlined'}
						onPress={() => onChoiceSelect('settings')}>
						Settings
					</MenuButton>
					<MenuButton
						icon={'information-outline'}
						mode={'outlined'}
						onPress={() => onChoiceSelect('about')}>
						About
					</MenuButton>
				</View>
				{!(['android', 'ios', 'web'] as PlatformOSType[]).includes(Platform.OS) && (
					<MenuButton icon={'power'} mode={'outlined'} onPress={() => process.exit()}>
						Quit
					</MenuButton>
				)}
			</View>
		</FadeViewMemo>
	);
};

export const StatItem = ({
	label,
	value,
	variant,
}: {
	label: string;
	value: number | string;
	variant?: VariantProp<never>;
}) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				width: '100%',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}>
			<Text variant={variant ?? 'titleLarge'}>{label}:</Text>
			<Text variant="titleMedium" style={{ maxWidth: '60%' }}>
				{value}
			</Text>
		</View>
	);
};
export const StatsMenu = ({ onBack }: MenuProps) => {
	const { colors } = useTheme();
	const {
		total_sessions,
		time_spent,
		images_seen,
		correct_ai,
		correct_real,
		incorrect_ai,
		incorrect_real,
		resetStats,
	} = useStatsStore();
	return (
		<MenuParent title="Statistics" onBack={onBack}>
			<StatItem label="Total Sessions" value={total_sessions} />
			<StatItem label="Total Time Spent" value={time_spent} />
			<StatItem label="Images Seen" value={images_seen} />
			<View style={{ width: '100%', marginVertical: 10 }}>
				<Text variant="titleLarge" style={{ textDecorationLine: 'underline' }}>
					Non-AI
				</Text>
				<StatItem label="Correct" value={correct_real} variant="titleMedium" />
				<StatItem label="Incorrect" value={incorrect_real} variant="titleMedium" />
			</View>
			<View style={{ width: '100%', marginVertical: 10 }}>
				<Text variant="titleLarge" style={{ textDecorationLine: 'underline' }}>
					AI
				</Text>
				<StatItem label="Correct" value={correct_ai} variant="titleMedium" />
				<StatItem label="Incorrect" value={incorrect_ai} variant="titleMedium" />
			</View>
			<View style={{ width: '100%', paddingVertical: 20 }}>
				<MenuButton
					mode="contained"
					icon={'alert-outline'}
					style={{ backgroundColor: colors.error }}
					labelStyle={{ color: colors.onError }}
					onPress={resetStats}>
					Reset Stats
				</MenuButton>
			</View>
		</MenuParent>
	);
};

export const SettingsMenu = ({ onBack }: MenuProps) => {
	return (
		<MenuParent title="Settings" onBack={onBack}>
			<View style={{ width: '100%' }}>
				<MenuButton mode={'outlined'} onPress={async () => await Image.clearDiskCache()}>
					Clear Image Disk Cache
				</MenuButton>
				<MenuButton mode={'outlined'} onPress={async () => await Image.clearMemoryCache()}>
					Clear Image Memory Cache
				</MenuButton>
			</View>
		</MenuParent>
	);
};

export const AboutMenu = ({ onBack }: MenuProps) => {
	const { colors } = useTheme();
	return (
		<MenuParent title="About" onBack={onBack}>
			<View style={{ width: '100%' }}>
				<Text>This game is about testing your ability to detect AI art!{'\n'}</Text>
				{/* Maybe upload to itch ???? */}
				{/* <Text>
					If you like the game, rate it on
					<Text
						style={{ color: colors.primary }}
						onPress={() => openBrowserAsync('https://github.com/kuzulabz/ArtGimon')}>
						{' '}
						Itch.io
					</Text>
					!
				</Text> */}
				<Text>
					{'\n'}Interested in the source code? Find it on
					<Text
						style={{ color: colors.primary }}
						onPress={() => openBrowserAsync('https://github.com/kuzulabz/ArtGimon')}>
						{' '}
						Github
					</Text>
					!
				</Text>
				<Divider
					style={{
						height: 1,
						width: '100%',
						alignSelf: 'center',
						backgroundColor: colors.onBackground,
						marginVertical: 20,
					}}
				/>
				<Text>The images shown are sourced from Gelbooru and Aibooru!</Text>
				<Divider
					style={{
						height: 1,
						width: '100%',
						alignSelf: 'center',
						backgroundColor: colors.onBackground,
						marginVertical: 20,
					}}
				/>
				<Text>Created by KuzuLabz</Text>
			</View>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					width: '100%',
					paddingTop: 20,
				}}>
				<IconButton icon="earth" size={42} />
				<IconButton
					icon="github"
					onPress={() => openBrowserAsync('https://github.com/kuzulabz/')}
					size={42}
				/>
				{/* <IconButton icon={require('../../../assets/icons/itchio.png')} size={42} /> */}
			</View>
		</MenuParent>
	);
};
