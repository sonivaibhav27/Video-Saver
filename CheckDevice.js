import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Qonversion from "react-native-qonversion";

import Navigation from "./src/navigation";

Qonversion.launchWithKey("KeLfiChTvAJ7Xk-w49QVGcMklAlUFqOS", false);
export default () => {
  return (
    <View style={styles.flex1}>
      {Platform.OS === "android" ? (
        <Navigation />
      ) : (
        <View style={styles.screenCenter}>
          <Text>
            We Don't support for {Platform.OS} Now, We will release soon :)
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  screenCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
