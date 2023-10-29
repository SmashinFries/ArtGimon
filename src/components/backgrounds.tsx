import Animated from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export const MenuBackground = () => {
    return <View style={[menuBgStyle.container]}></View>;
};

const menuBgStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
});
