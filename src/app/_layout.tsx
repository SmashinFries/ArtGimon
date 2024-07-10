import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import {
	MD3DarkTheme,
	MD3LightTheme,
	Provider,
	adaptNavigationTheme,
	configureFonts,
} from 'react-native-paper';
import { DefaultTheme, DarkTheme as NavDarkTheme, ThemeProvider } from '@react-navigation/native';
import { useThemeStore } from '../store/themes';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
	reactNavigationLight: DefaultTheme,
	reactNavigationDark: NavDarkTheme,
});

const RootLayout = () => {
	const { darkMode } = useThemeStore();
	const [loaded, error] = useFonts({
		'LilitaOne-Regular': require('../../assets/fonts/LilitaOne-Regular.ttf'),
	});

	const baseFont = {
		fontFamily: 'LilitaOne-Regular',
	} as const;

	const baseVariants = configureFonts({ config: baseFont });
	const fonts = configureFonts({
		config: {
			...baseVariants,
		},
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	return (
		<Provider theme={darkMode ? { ...MD3DarkTheme, fonts } : { ...MD3LightTheme, fonts }}>
			<ThemeProvider value={darkMode ? DarkTheme : LightTheme}>
				<Stack
					screenOptions={{
						headerShown: false,
						animation: 'slide_from_right',
						animationTypeForReplace: 'push',
					}}
				/>
			</ThemeProvider>
		</Provider>
	);
};

export default RootLayout;
