import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, ToastAndroid, View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideOutLeft,
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

type MenuButtonProps = {
    title?: string;
    route?: string;
    onPress?: () => void;
    disabled?: boolean;
};
export const MenuButton = ({ title, route, disabled, onPress }: MenuButtonProps) => {
    const { colors } = useTheme();
    const scale = useSharedValue(1);
    const buttonAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: 1,
            transform: [{ scale: scale.value }],
        };
    });

    const onPressIn = () => {
        scale.value = withSpring(0.9);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <Animated.View
            entering={SlideInRight}
            exiting={SlideOutLeft}
            style={[buttonAnimStyle, ButtonStyles.container]}
        >
            {route ? (
                <Link href={{ pathname: route }} asChild>
                    <Button
                        mode="outlined"
                        uppercase
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        labelStyle={{ fontWeight: '900' }}
                        style={{ borderColor: colors.primary, borderWidth: 3 }}
                        contentStyle={[ButtonStyles.buttonContainer]}
                    >
                        {title}
                    </Button>
                </Link>
            ) : (
                <Button
                    mode="outlined"
                    uppercase
                    onPressIn={onPressIn}
                    onPress={onPress}
                    onPressOut={onPressOut}
                    style={{ borderColor: colors.primary, borderWidth: 3 }}
                    labelStyle={{ fontWeight: '900' }}
                    contentStyle={[ButtonStyles.buttonContainer]}
                >
                    {title}
                </Button>
            )}
        </Animated.View>
    );
};

export const MenuIconButton = ({
    title,
    route,
    disabled,
    icon,
    fixedWidth,
    onPress,
}: MenuButtonProps & { icon?: string; fixedWidth?: number | string }) => {
    const { colors } = useTheme();
    const isActive = useSharedValue(0); // 0 = inactive, 1 = active (hover/press)
    const showTitle = useSharedValue(false);
    const titleWidth = useSharedValue(0);
    const buttonWidth = useSharedValue(0);
    // const [ buttonWidth, setButtonWidth ] = useState(0);

    const containerAnimStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                isActive.value,
                [0, 1],
                [colors.background, colors.primaryContainer],
            ),
            width: fixedWidth ?? 'auto',
            // width: withTiming(buttonWidth.value, { duration: 500 }),
        };
    });

    // attempt to add title animation
    const titleAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(isActive.value, [0, 1], [0, 1]),
        };
    });

    const onPressIn = () => {
        showTitle.value = true;
        buttonWidth.value = withTiming(buttonWidth.value + titleWidth.value, { duration: 400 });
        isActive.value = withTiming(1, { duration: 500 });
    };

    const onPressOut = () => {
        showTitle.value = false;
        isActive.value = withTiming(0, { duration: 500 });
    };

    return (
        <Pressable
            disabled={disabled}
            onPress={() => {
                router.push({ pathname: route });
                onPress && onPress();
            }}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onHoverIn={onPressIn}
            onHoverOut={onPressOut}
        >
            <Animated.View
                onLayout={(e) => (buttonWidth.value = e.nativeEvent.layout.width)}
                style={[
                    containerAnimStyle,
                    ButtonStyles.buttonContainer,
                    {
                        justifyContent: 'center',
                        minHeight: 60,
                        borderWidth: 4,
                        borderRadius: 24,
                        borderColor: colors.primary,
                        margin: 20,
                        flexDirection: icon && title ? 'row' : 'column',
                        alignItems: 'center',
                    },
                ]}
            >
                {icon && <IconButton size={60} icon={icon} iconColor={colors.secondary} />}
                {title ? (
                    <View>
                        <Animated.Text
                            onLayout={(e) => (titleWidth.value = e.nativeEvent.layout.width)}
                            style={[
                                {
                                    width: '100%',
                                    alignSelf: 'center',
                                    fontSize: 28,
                                    color: colors.onPrimaryContainer,
                                    paddingHorizontal: 20,
                                    fontWeight: '900',
                                },
                            ]}
                        >
                            {title}
                        </Animated.Text>
                    </View>
                ) : null}
            </Animated.View>
        </Pressable>
    );
};

const ButtonStyles = StyleSheet.create({
    container: {
        marginVertical: 12,
        minWidth: '50%',
        maxWidth: '80%',
    },
    buttonContainer: {
        alignSelf: 'center',
        minWidth: '50%',
        maxWidth: '80%',
    },
});
