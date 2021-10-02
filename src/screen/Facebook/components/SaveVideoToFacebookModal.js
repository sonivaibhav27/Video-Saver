import React from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ScrollView,
} from "react-native";

//custom imports
import { Icons } from "../../../utils";
import { Section } from "../../Help/components";

const SaveVideoToFacebookModal = ({ closeModal }) => {
  const aValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(aValue, {
      duration: 600,
      useNativeDriver: true,
      toValue: 1,
    }).start();
  }, [aValue]);

  return (
    <View style={styles.absoluteFill}>
      <TouchableOpacity
        onPress={closeModal}
        activeOpacity={0.9}
        style={styles.crossC}
      >
        <View style={styles.cross}>
          <Icons.Entypo name="cross" size={25} color="#fff" />
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.downloadErrContainer,
          {
            opacity: aValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            transform: [
              {
                scale: aValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Solve Download Error</Text>
        </View>
        <ScrollView style={styles.flex1}>
          <Section
            index={1}
            image={require("../../../assets/sav.jpeg")}
            label="Saved the video , you wish to download"
          />
          <Section
            index={2}
            image={require("../../../assets/saved.jpeg")}
            label='press "saved" and copy link of video to download'
          />
          <Section
            index={3}
            image={require("../../../assets/CopyLink.jpeg")}
            label="Copy the link of video "
          />
          <Section
            index={4}
            image={require("../../../assets/paste.jpeg")}
            label='Paste on "Get Link"'
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFill: { ...StyleSheet.absoluteFill, backgroundColor: "#fff" },
  downloadErrContainer: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "#fff",
    // elevation: 2,
    marginTop: 20,
  },
  cross: {
    backgroundColor: "#4bb543",
    borderRadius: 30,
    padding: 6,
  },
  crossC: {
    zIndex: 30,
    // alignSelf: "flex-end",
    marginLeft: 10,
    position: "absolute",
    right: 10,
  },
  titleContainer: {
    padding: 10,
  },
  titleText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  flex1: { flex: 1 },
});

export default SaveVideoToFacebookModal;
