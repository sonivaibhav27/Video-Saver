import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/core";

//custom imports
import { Icons } from "../../../utils";

function IconTouchableButton(iconName, onPress) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.button}
      hitSlop={{
        bottom: 5,
        top: 5,
        left: 5,
        right: 5,
      }}
    >
      {iconName !== "help-with-circle" ? (
        <Icons.AntDesign name={iconName} size={25} color="#000" />
      ) : (
        <Icons.Entypo name={iconName} size={25} color="#333" />
      )}
    </TouchableOpacity>
  );
}

export default () => {
  const navigation = useNavigation();
  const onHelpPress = () => {
    navigation.navigate("help");
  };
  const onSettingPress = () => {
    navigation.navigate("settings");
  };
  return (
    <View style={styles.container}>
      {IconTouchableButton("help-with-circle", onHelpPress)}
      <View>
        <Text style={styles.headerTitle}>videosaver</Text>
      </View>
      <View style={styles.actionButtonContainer}>
        {IconTouchableButton("setting", onSettingPress)}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    marginBottom: 20,
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    fontFamily: "Roboto",
    textAlign: "center",
  },
  actionButtonContainer: {
    flexDirection: "row",
  },
  button: {
    marginLeft: 15,
    marginRight: 10,
  },
});
