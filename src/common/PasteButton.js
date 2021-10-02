import * as React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

const PasteButton = ({ onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.textStyle}>Paste</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0.8,
    backgroundColor: "#EEE",
    padding: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  textStyle: {
    fontSize: 18,
  },
});

export default PasteButton;
