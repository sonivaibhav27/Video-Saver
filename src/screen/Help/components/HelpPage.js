import React from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Easing,
  Dimensions,
} from "react-native";

//custom imports;
import { Icons } from "../../../utils";
import Section from "./Section";

const { height } = Dimensions.get("window");

const HelpPage = ({ data, closeModal }) => {
  const animated = React.useRef(new Animated.Value(0)).current;
  console.log(data.image);
  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: 1,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 300,
    }).start();
  }, [animated]);

  const _closeModal = () => {
    Animated.timing(animated, {
      toValue: 0,
      easing: Easing.linear,
      useNativeDriver: true,
      duration: 300,
    }).start(() => {
      closeModal();
    });
  };
  return (
    <Animated.ScrollView
      style={[
        styles.modalStyle,
        {
          transform: [
            {
              translateY: animated.interpolate({
                inputRange: [0, 1],
                outputRange: [height, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{`${data.name}`} Help</Text>
        <TouchableOpacity
          onPress={_closeModal}
          activeOpacity={0.8}
          hitSlop={{
            right: 5,
            left: 5,
            top: 5,
            bottom: 5,
          }}
          style={styles.crossButton}
        >
          <Icons.Entypo name="cross" size={25} color="#333" />
        </TouchableOpacity>
      </View>
      <Section
        image={data.image}
        label={"Copy Link from " + data.name}
        index={1}
      />
      <Section
        image={require("../../../assets/paste.jpeg")}
        label="paste link"
        index={2}
      />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    borderRadius: 20,
    elevation: 5,
    overflow: "hidden",
  },
  headerContainer: {
    backgroundColor: "#fff",
    padding: 10,
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  crossButton: {
    zIndex: 800,
    right: 10,
    borderRadius: 10,
    position: "absolute",
    top: 10,
  },
});

export default HelpPage;
