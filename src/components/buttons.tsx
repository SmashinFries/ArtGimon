import { Pressable, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

type MenuButtonProps = {
    title: string;
    onPress?: () => void;
}
export const MenuButton = ({title, onPress}:MenuButtonProps) => {
    const scale = useSharedValue(1);
    const buttonAnimStyle = useAnimatedStyle(() => {
        return {
            opacity: 1,
            transform: [
                {scale: scale.value}
            ]
        }
    });

    const onPressIn = () => {
        scale.value = withSpring(0.9);
    }

    const onPressOut = () => {
        scale.value = withSpring(1);
    }

    return(
        <Animated.View style={[buttonAnimStyle,ButtonStyles.container]}>
            {/* <Pressable style={{justifyContent:'center', alignItems:'center', borderWidth:1, borderRadius:12, padding:12, minWidth:'50%', maxWidth:'60%'}}>
                <Text>{title}</Text>
            </Pressable> */}
            <Button mode="contained" onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} labelStyle={{fontWeight:'900'}} contentStyle={[ButtonStyles.buttonContainer]} >{title}</Button>
        </Animated.View>
    );
};

const ButtonStyles = StyleSheet.create({
    container: {
        marginVertical: 12,
    },
    buttonContainer: {
        alignSelf:'center',
        minWidth:'50%', 
        maxWidth:'65%'
    }
});