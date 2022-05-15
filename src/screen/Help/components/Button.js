import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const Button = ({ label, onPress, title }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress(label, title)}
      style={styles.button}
    >
      <Text style={styles.label}>{title} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    margin: 8,
    borderRadius: 2,
    backgroundColor: "#eee",
  },
  label: {
    fontSize: 18,
    color: "#222",
    textTransform: "capitalize",
    fontWeight: "500",
    textAlign: "center",
  },
});
export default Button;
