import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

//custom imports
import { Icons } from "../../../utils";

const { width, height } = Dimensions.get("window");

const ICON_SIZE = 35;

function returnIconBasedOnLabel(label, iconName) {
  switch (label) {
    case "facebook":
    case "whatsapp":
      return (
        <Icons.FontAwesome name={iconName} size={ICON_SIZE} color={"#fff"} />
      );
    case "instagram":
      return (
        <LinearGradient
          colors={["#5851db", "#833ab4", "#c13584", "#e1306c", "#fd1d1d"]}
          style={styles.common}
        >
          <Icons.AntDesign name="instagram" size={ICON_SIZE} color={"#fff"} />
          <Text style={styles.text}>{label}</Text>
        </LinearGradient>
      );
    default:
      return <Icons.Entypo name={iconName} size={ICON_SIZE} color={"#fff"} />;
  }
}

const IconButton = ({ onPress, backgroundColor, label, iconName }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.bigContainer}
      onPress={onPress}
    >
      <View
        style={[
          styles.common,
          {
            backgroundColor,
          },
        ]}
      >
        {returnIconBasedOnLabel(label, iconName)}
        {label !== "instagram" && <Text style={styles.text}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  common: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    width: width / 3.4,
    height: height * 0.16,
    elevation: 2,
  },
  bigContainer: {
    marginTop: 10,
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    fontStyle: "italic",
  },
});
export default IconButton;
