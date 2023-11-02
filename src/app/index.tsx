import { BackHandler, Platform, ToastAndroid, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MenuIconButton } from '../components/buttons';
import { StatusBar } from 'expo-status-bar';
import { useThemeStore } from '../store/themes';

const RootPage = () => {
    const { darkMode } = useThemeStore();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="displayLarge">Art Gimon</Text>
            {/* <MenuButton title="Play" route="/game" />
            <MenuButton title="Statistics" />
            <MenuButton title="Settings" route="/settings" /> */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                <MenuIconButton icon="play" route="/game" />
                <MenuIconButton
                    icon="chart-bar"
                    onPress={() => ToastAndroid.show('Stats coming soon', ToastAndroid.SHORT)}
                />
                <MenuIconButton icon="cog" route="/settings" />
                {Platform.OS === 'windows' ||
                    (Platform.OS === 'macos' && (
                        <MenuIconButton icon="close" onPress={() => BackHandler.exitApp()} />
                    ))}
            </View>
            <StatusBar style={darkMode ? 'light' : 'dark'} />
        </View>
    );
};

export default RootPage;
