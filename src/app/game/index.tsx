import { View, useWindowDimensions } from "react-native";
import { Text } from "react-native-paper";
import { MenuButton, MenuIconButton } from "../../components/buttons";
import { EndlessHeader } from "../../components/headers";

const GamePage = () => {
    const {width} = useWindowDimensions();
    return(
        <>
            <EndlessHeader />
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text variant="displayLarge">Select Mode</Text>
                <MenuIconButton title="Endless" route="/game/endless" fixedWidth={width-(width*.75)} />
                <MenuIconButton title="Time Attack" disabled fixedWidth={width-(width*.75)} />
                <MenuIconButton title="Sets" disabled fixedWidth={width-(width*.75)} />
            </View>
        </>
        
    )
};

export default GamePage;