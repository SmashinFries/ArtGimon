import { Appbar, Divider, Text } from "react-native-paper";
import { router } from "expo-router";
import { View, useWindowDimensions } from "react-native";
import Animated, { SharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

export const EndlessHeader = () => {
    return(
        <Appbar.Header mode="medium">
            <Appbar.BackAction onPress={() => router.replace('/')} />
            {/* <Appbar.Action icon="magnify" />
            <Appbar.Action icon="dots-vertical" /> */}
        </Appbar.Header>
    );
};

type GameStateHeaderProps = {
    correct: number;
    incorrect: number;
};
export const GameStateHeader = ({correct, incorrect}:GameStateHeaderProps) => {

    return(
        <Animated.View style={[{width:'100%', }]}>
            <View style={{marginTop:20, flexDirection:'row', justifyContent:'space-evenly'}}>
                <Text style={{fontWeight:'900', color:'green'}} variant="titleLarge">{correct}</Text>
                <Text>|</Text>
                <Text style={{fontWeight:'900', color:'red'}} variant="titleLarge">{incorrect}</Text>
            </View>
            <Text style={{textAlign:'center'}}>{correct && incorrect ? (correct/incorrect).toFixed(2) : correct ?? "-" + incorrect}</Text>
            <Divider style={{marginVertical:20, width:'90%', alignSelf:'center'}} />
        </Animated.View>
    );
};