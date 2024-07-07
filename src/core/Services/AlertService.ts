import { Alert } from "react-native";

export class AlertService {
    static alert(message: string) {
        Alert.alert(message);
    }

    static confirm(title: string, message: string, onConfirm: () => void) {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "Abbrechen",
                    style: "cancel"
                },
                {
                    text: "Ja",
                    onPress: onConfirm
                }
            ],
            { cancelable: false }
        );
    }
}