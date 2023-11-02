import { Dialog, Text, Button } from 'react-native-paper';
import { DialogProps } from '../types/dialog';
import { router } from 'expo-router';

export const QuitConfirmDialog = (props: DialogProps) => {
    const onConfirm = () => {
        router.back();
    };

    return (
        <Dialog {...props}>
            <Dialog.Title>Quit Game</Dialog.Title>
            <Dialog.Content>
                <Text>Are you sure you want to quit?</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={props.onDismiss}>Cancel</Button>
                <Button onPress={onConfirm}>Quit</Button>
            </Dialog.Actions>
        </Dialog>
    );
};
