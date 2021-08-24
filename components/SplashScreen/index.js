import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";

export default () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Your one stop to download videos from your social media.
      </Text>
      <View>
        <ActivityIndicator
          style={styles.marginTop}
          size="large"
          color="#3299cc"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    marginTop: 20,
    color: "#444",
    fontSize: 18,
  },
  marginTop: {
    marginTop: 20,
  },
});
