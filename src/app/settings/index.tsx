import { View, ScrollView } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useThemeStore } from '../../store/themes';
import { setStatusBarStyle } from 'expo-status-bar';

const SettingsPage = () => {
    const { darkMode, toggleDarkMode } = useThemeStore();

    const onDarkModeChange = (val: boolean) => {
        toggleDarkMode(val);
        setStatusBarStyle(val ? 'light' : 'dark'); // REFUSES TO UPDATE
        console.log('Dark mode changed to', val ? 'on' : 'off');
    };

    return (
        <ScrollView>
            <List.Item
                title="Dark Mode"
                right={(props) => (
                    <Switch
                        style={[props.style]}
                        value={darkMode}
                        onValueChange={onDarkModeChange}
                    />
                )}
            />
        </ScrollView>
    );
};

export default SettingsPage;
