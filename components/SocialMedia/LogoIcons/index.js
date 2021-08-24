import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import TIcon from "react-native-vector-icons/Entypo";
import WhatsappIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";
const { width } = Dimensions.get("window");

const ICON_SIZE = 35;
export const IconDisplay = ({
  isfb,
  isWp,
  name,
  isTw,
  onPress,
  backgroundColor,
  text,
}) => {
  const Icons = isfb ? WhatsappIcon : isWp ? WhatsappIcon : isTw ? TIcon : Icon;

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
        <Icons name={name} size={ICON_SIZE} color={"#fff"} />
        <Text style={styles.text}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const InstagramIcon = ({ navigation, text }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.bigContainer}
      onPress={() => navigation.navigate("insta")}
    >
      <LinearGradient
        colors={["#5851db", "#833ab4", "#c13584", "#e1306c", "#fd1d1d"]}
        style={styles.common}
      >
        <Icon name="instagram" size={ICON_SIZE} color={"#fff"} />
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const ImageIcon = ({ isVimeo, backgroundColor, onPress, text }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.bigContainer}
    >
      <View style={[styles.common, { backgroundColor }]}>
        <TIcon
          name={isVimeo ? "vimeo" : "pinterest"}
          color={"#fff"}
          size={ICON_SIZE}
        />
        <Text style={styles.text}>{text}</Text>
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
    height: width * 0.3,
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
