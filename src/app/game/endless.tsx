import { Image } from "expo-image";
import { View, useWindowDimensions } from "react-native";
import { useEndless } from "../../hooks/game/useEndless";
import { ActivityIndicator, Button, IconButton, Text, useTheme } from "react-native-paper";
import { useEffect, useMemo, useState } from "react";
import * as WebBrowser from 'expo-web-browser';
import { router } from "expo-router";
import { EndlessHeader, GameStateHeader } from "../../components/headers";
import Animated, { FadeIn, FadeOut, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useImagePan } from "../../hooks/game/useGestures";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActionBar } from "../../components/actionBar";

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const EndlessGame = () => {
    const { colors } = useTheme();
    const { width, height } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const {currentImage, correct, incorrect, getRandomImage, answer, isCorrect, isCompleted, weblink, onSelect} = useEndless();
    const {animatedContainerStyle, animatedImgStyle, answerChoice, panGesture, showNext } = useImagePan();

    const [imageHeight, setImageHeight] = useState(0);

    const ar = useMemo(() => (currentImage?.image_width ?? 1) / (currentImage?.image_height ?? 1),[currentImage?.image_width, currentImage?.image_height])

    useEffect(() => {
        if (!isCompleted && answerChoice.value !== 'none') {
            console.log('answerChoice', answerChoice.value);
            onSelect(answerChoice.value);
        }
    },[answerChoice.value, isCompleted])

    return(
        <SafeAreaView style={{alignItems:'center', flex:1}}>
            <GameStateHeader correct={correct} incorrect={incorrect} />
            <View style={{justifyContent:'center', flex:1}}>
                {currentImage ? <GestureDetector gesture={panGesture}>
                    <Animated.View  style={[animatedContainerStyle, {alignSelf:'center', justifyContent:'center', marginVertical:20, maxHeight:height - (height*0.35), height:'auto', borderRadius:12, width:'100%', maxWidth:width - (width*0.15), }]}>
                        <Animated.Image 
                            onLayout={e => setImageHeight(e.nativeEvent.layout.height)}
                            resizeMode={'contain'} 
                            onLoadStart={() => setLoading(true)} 
                            onLoadEnd={() => setLoading(false)}  
                            source={{uri:currentImage?.file_url}} 
                            style={[animatedImgStyle, {alignSelf:'center', height:'auto', borderRadius:12, width:'100%', aspectRatio:ar }]}  />
                        
                        {isCompleted && <Animated.View entering={FadeIn} exiting={FadeOut} style={{alignSelf:'center', position:'absolute',  justifyContent:'center', width:'100%', height:'auto', aspectRatio:ar, borderRadius:12, backgroundColor:isCorrect ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0,0.4)'}}>
                            <IconButton style={{alignSelf:'center', backgroundColor:'rgba(0,0,0,0.6)',}} iconColor={answerChoice.value === answer ? "green" : "red"} size={48} icon={answerChoice.value === answer ? 'check' : 'close'} />
                            <Text variant="titleLarge" style={{color:'#FFF', textAlign:'center'}}>It's {answer === 'ai' ? 'AI' : 'Real'} !</Text>
                        </Animated.View>}
                    </Animated.View>
                </GestureDetector> : <ActivityIndicator size={'large'} />}
            </View>
            {isCompleted && 
                <View style={{width:'100%', height:undefined, }}>
                    <Button onPress={() => {answerChoice.value = 'none'; getRandomImage()}}>Next</Button>
                    <Button onPress={() => console.log(imageHeight)}>Test</Button>
                    <ActionBar sourceUrl={weblink} isAnswered={answerChoice.value !== 'none'}  />
                </View>
            }
        </SafeAreaView>
        
    )
};

export default EndlessGame;