import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

const CustomActivityIndicator = ({ text }) => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <ActivityIndicator color="#333" size="small" />
        <Text style={styles.textStyle}>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    paddingHorizontal: 40,
    borderRadius: 5,
    // backgroundColor: "rgba(0,0,0,0.3)",
  },
  main: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingVertical: 20,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#eee",
    borderRadius: 3,
    alignItems: "center",
  },
  textStyle: {
    marginLeft: 20,
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textTransform: "capitalize",
  },
});

export default CustomActivityIndicator;
