import React from "react";
import AppLovinMax from "react-native-applovin-max";
import { StyleSheet, View } from "react-native";

const BannerID = "a72a96cf1d4567d5";
export default ({ show = true, giveTopMargin = true }) => {
  if (show) {
    return (
      <View style={giveTopMargin && styles.align_margin}>
        <AppLovinMax.AdView
          adUnitId={BannerID}
          adFormat={AppLovinMax.AdFormat.MREC}
          style={styles.banner}
        />
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  align_margin: { marginTop: 20 },
  banner: {
    backgroundColor: "#f1f1f1",
    width: "100%",
    height: AppLovinMax.getAdaptiveBannerHeightForWidth(-1),
    alignSelf: "center",
  },
});
