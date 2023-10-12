import { View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { MenuButton } from "../components/buttons";
import { getFakeImage } from "../api/aibooru";

const RootPage = () => {
    return(
        <SafeAreaView style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text variant="displayLarge">Root Page</Text>
            <MenuButton title="Start" onPress={() => getFakeImage({params:{limit:1}})} />
            <MenuButton title="Statistics" />
            <MenuButton title="Settings" />
            <MenuButton title="Quit" />
        </SafeAreaView>
    );
}

export default RootPage;