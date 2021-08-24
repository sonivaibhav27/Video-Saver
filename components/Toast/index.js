import { ToastAndroid } from "react-native";

export default (message, duration = "SHORT") => {
  ToastAndroid.showWithGravityAndOffset(
    message,
    ToastAndroid[duration],
    ToastAndroid.BOTTOM,
    0,
    20
  );
};
