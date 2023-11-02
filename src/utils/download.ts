import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';
import { ToastAndroid } from 'react-native';

export const saveImage = async (url: string, name = null) => {
    if (!url) return;
    const { status } = await MediaLibrary.requestPermissionsAsync();
    const formattedTitle = name ?? 'art' + url.split('/').pop()?.split('.')[0];
    const fileType = url.split('.').at(-1);
    const fileUri = FileSystem.documentDirectory + formattedTitle + `.${fileType}`;
    if (status === MediaLibrary.PermissionStatus.GRANTED) {
        try {
            const result = await FileSystem.downloadAsync(url, fileUri);
            await MediaLibrary.saveToLibraryAsync(result.uri);
            await impactAsync(ImpactFeedbackStyle.Light);
            ToastAndroid.show('Image Saved', ToastAndroid.SHORT);
        } catch (e) {
            console.log(e);
        }
    }
};
