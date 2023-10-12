import 'react-native-gesture-handler'
import { Stack } from 'expo-router';
import { Provider } from 'react-native-paper';

export default function RootLayout() {
  return <Provider><Stack screenOptions={{headerShown:false}} /></Provider>;
}
