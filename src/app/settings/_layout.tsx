import { Stack } from "expo-router";
import { PaperHeader } from "../../components/headers";

const SettingsLayout = () => {
    return(
        <Stack screenOptions={{header:props => <PaperHeader {...props} />}}>
            <Stack.Screen name="index" options={{title:'Settings'}} />
        </Stack>
    );
};

export default SettingsLayout;