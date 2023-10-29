import 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { MD3DarkTheme, MD3LightTheme, Provider, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme, DarkTheme as NavDarkTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultTheme,
    reactNavigationDark: NavDarkTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme,
});

const RootLayout = () => {
    return (
        <Provider theme={MD3DarkTheme}>
            <ThemeProvider value={DarkTheme}>
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
