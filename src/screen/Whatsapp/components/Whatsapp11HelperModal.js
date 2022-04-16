import React from "react";
import {
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  Image,
  View,
  TouchableOpacity,
} from "react-native";

const DEVICE_WIDTH = Dimensions.get("window").width;
const Whatsapp11HelperModal = ({ onOkPress, onCancelPress }) => {
  const animatedRef = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(animatedRef, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [animatedRef]);
  const animateToZero = (callback) => {
    Animated.timing(animatedRef, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(callback, 100);
    });
  };
  const _onOkPress = () => {
    animateToZero(onOkPress);
  };
  const _onCancelPress = () => {
    onCancelPress();
  };
  const translateY = animatedRef.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [DEVICE_WIDTH + 80, DEVICE_WIDTH + 80, 0, 0],
    extrapolate: "clamp",
  });
  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX: translateY }] }}>
        <View style={styles.innerContainer}>
          <View>
            <Text style={styles.mainText}>
              To Get All Status in Android 11 or Later.
            </Text>
            <Text style={styles.secText}>
              Please Allow Access to ".Statues" Folder.
            </Text>
          </View>
          <View>
            <Image
              style={styles.image}
              source={require("../../../assets/Whatsapp_11_use_this_folder.png")}
              resizeMode="contain"
            />
          </View>
          <View style={styles.btnContainer}>
            <Text onPress={_onCancelPress} style={styles.cancel}>
              Cancel
            </Text>
            <TouchableOpacity onPress={_onOkPress} style={styles.grand}>
              <Text style={styles.grandtext}>Grant Access</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: "center",
  },
  image: {
    width: DEVICE_WIDTH - 60,
  },
  innerContainer: {
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    elevation: 1,
    borderRadius: 10,
    padding: 10,
  },
  mainText: {
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
  secText: {
    textAlign: "center",
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  grand: {
    flex: 1.5,
    backgroundColor: "#215E7C",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },
  cancel: {
    flex: 0.7,
    textAlign: "center",
  },
  grandtext: {
    color: "#fff",
  },
});

export default Whatsapp11HelperModal;
