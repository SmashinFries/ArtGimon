import { BackHandler, Platform, ToastAndroid, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MenuButton, MenuIconButton } from '../components/buttons';
import { StatusBar      } from 'expo-status-bar';

const RootPage = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text variant="displayLarge">AI Gimon</Text>
            {/* <MenuButton title="Play" route="/game" />
            <MenuButton title="Statistics" />
            <MenuButton title="Settings" route="/settings" /> */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                <MenuIconButton icon="play" route="/game" />
                <MenuIconButton icon="chart-bar" onPress={() => ToastAndroid.show('Stats coming soon', ToastAndroid.SHORT)} />
                <MenuIconButton icon="cog" onPress={() => ToastAndroid.show('Working on it :)', ToastAndroid.SHORT)} />
                {Platform.OS === 'windows' ||
                    (Platform.OS === 'macos' && (
                        <MenuIconButton icon="close" onPress={() => BackHandler.exitApp()} />
                    ))}
            </View>
            <StatusBar style={'light'} />
        </View>
    );
};

export default RootPage;
