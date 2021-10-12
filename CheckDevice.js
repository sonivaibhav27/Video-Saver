import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
// import Qonversion from "react-native-qonversion";

import { Navigation } from "./src";

// Qonversion.launchWithKey("KeLfiChTvAJ7Xk-w49QVGcMklAlUFqOS", false);
export default () => {
  // const qonOffering = async () => {
  //   try {
  //     //Qonversion.setDebugMode();
  //     const offering = await Qonversion.offerings();
  //     if (offering.main != null && offering.main.products.length > 0) {
  //       console.log(offering.main.products);
  //       const purchase = await Qonversion.purchase("ads_free_lifetime");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

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
