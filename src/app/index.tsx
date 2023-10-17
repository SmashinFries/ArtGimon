import { BackHandler, Platform, View } from "react-native";
import { Text } from "react-native-paper";
import { MenuButton, MenuIconButton } from "../components/buttons";

const RootPage = () => {
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text variant="displayLarge">AI Gimon</Text>
            {/* <MenuButton title="Play" route="/game" />
            <MenuButton title="Statistics" />
            <MenuButton title="Settings" route="/settings" /> */}
            <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'center'}}>
                <MenuIconButton icon="play" route="/game" />
                <MenuIconButton icon="chart-bar" />
                <MenuIconButton icon="cog" />
                {Platform.OS === 'windows' || Platform.OS === 'macos' && <MenuIconButton icon="close" onPress={() => BackHandler.exitApp()} />}
            </View>
        </View>
    );
}

export default RootPage;