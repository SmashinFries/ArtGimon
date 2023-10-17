import { Share, StyleSheet, ToastAndroid, View, useWindowDimensions } from "react-native";
import { Divider, IconButton, useTheme } from "react-native-paper";
import * as WebBrowser from 'expo-web-browser';
import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

type ActionBarProps = {
    sourceUrl: string;
    isAnswered?: boolean;
};
export const ActionBar = ({isAnswered, sourceUrl}:ActionBarProps) => {
    const { colors } = useTheme();
    const { height } = useWindowDimensions();

    const slideStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateY: isAnswered ? withTiming(0) : withTiming(height)}
            ]
        }
    });
    return(
        <Animated.View style={[styles.container, slideStyle]}>
            <Divider />
            <View style={[styles.iconsContainer]}>
                <IconButton icon="download-outline" />
                <IconButton
                    icon="bookmark-outline"
                    iconColor={colors.onSurfaceVariant}
                    onPress={() => ToastAndroid.show('Coming Soon!', ToastAndroid.SHORT)}
                />
                <IconButton icon='earth' onPress={() => WebBrowser.openBrowserAsync(sourceUrl, {windowFeatures:{"popup":false}})} />
                <IconButton
                    icon="share-variant"
                    onPress={() => Share.share({ url: 'share_url', message: 'share_url' })}
                />
            </View>
            <Divider />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    iconsContainer: {
        flexDirection: 'row',
        marginTop: 5,
        justifyContent: 'space-evenly',
    },
});
