import { ReactNode, useCallback, useEffect, useState } from "react";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { Text, TouchableRipple, useTheme } from "react-native-paper";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type ToggableChevronProps = {
    isExpanded: boolean;
};
const ToggableChevron = ({ isExpanded }: ToggableChevronProps) => {
    const iconRotation = useSharedValue(0);
    const { colors } = useTheme();

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${iconRotation.value}deg` }],
        };
    });

    const toggleRotation = useCallback(() => {
        iconRotation.value = withSpring(isExpanded ? 0 : 180, { damping: 10, mass: 0.5 });
    }, [iconRotation, isExpanded]);

    useEffect(() => {
        toggleRotation();
    }, [isExpanded, toggleRotation]);

    return (
        <Animated.View style={[animatedIconStyle]}>
            <MaterialCommunityIcons size={24} color={colors.onSurfaceVariant} name={'chevron-up'} />
        </Animated.View>
    );
};

type AccordionProps = {
    title: string;
    titleNumberOfLines?: number;
    description?: string;
    descriptionNumberOfLines?: number;
    descriptionStyle?: StyleProp<TextStyle>;
    children: ReactNode;
    initialExpand?: boolean;
};
export const Accordion = ({
    title,
    titleNumberOfLines,
    children,
    description,
    descriptionNumberOfLines,
    descriptionStyle,
    initialExpand = false,
}: AccordionProps) => {
    const { colors } = useTheme();
    const [isExpanded, setIsExpanded] = useState(initialExpand);
    const initialHeight = 0;
    const height = useSharedValue(0);
    const [totalHeight, setTotalHeight] = useState<number>(0);
    const [currentHeight, setCurrentHeight] = useState<number>(initialHeight);
    const animatedStyles = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    const toggleHeight = useCallback(() => {
        height.value = withSpring(
            height.value === totalHeight
                ? initialHeight
                : totalHeight - height.value + initialHeight,
            { damping: 10, mass: 0.5 },
        );
        setCurrentHeight(
            height.value === totalHeight
                ? initialHeight
                : totalHeight - height.value + initialHeight,
        );
        setIsExpanded((prev) => !prev);
    }, [height, totalHeight]);

    useEffect(() => {
        if (initialExpand) {
            toggleHeight();
        }
    }, [initialExpand, totalHeight]);

    return (
        <View style={{ overflow: 'visible' }}>
            <View style={{ backgroundColor: colors?.background }}>
                <TouchableRipple
                    onPress={toggleHeight}
                    rippleColor={colors.background}
                    borderless
                    style={{ paddingVertical: 8, paddingRight: 24 }}
                >
                    <View style={{ flexDirection: 'row', marginVertical: 6 }}>
                        <View style={[{ paddingLeft: 16 }, { flex: 1, justifyContent: 'center' }]}>
                            <Text
                                selectable={false}
                                numberOfLines={titleNumberOfLines}
                                style={[{ fontSize: 16 }]}
                            >
                                {title}
                            </Text>
                            {description ? (
                                <Text
                                    selectable={false}
                                    numberOfLines={descriptionNumberOfLines}
                                    style={[
                                        {
                                            fontSize: 14,
                                            color: colors.onSurfaceVariant,
                                        },
                                        descriptionStyle,
                                    ]}
                                >
                                    {description}
                                </Text>
                            ) : null}
                        </View>
                        <View style={[{ marginVertical: 6, paddingLeft: 8 }]}>
                            {/* <Animated.View>
                                <MaterialCommunityIcons
                                    size={24}
                                    color={colors.onSurfaceVariant}
                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                />
                            </Animated.View> */}
                            <ToggableChevron isExpanded={isExpanded} />
                        </View>
                    </View>
                </TouchableRipple>
            </View>
            <Animated.View style={[animatedStyles, { overflow: 'hidden' }]}>
                <View style={[StyleSheet.absoluteFill, { bottom: 'auto', paddingBottom: 10 }]}>
                    <View
                        onLayout={(e) => setTotalHeight(e.nativeEvent.layout.height)}
                        // style={{
                        //     paddingHorizontal: 20,
                        //     paddingVertical: 10,
                        //     paddingBottom: 20,
                        //     // backgroundColor: colors.secondaryContainer,
                        //     borderRadius: 12,
                        //     margin: 15,
                        // }}
                    >
                        {children}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
};