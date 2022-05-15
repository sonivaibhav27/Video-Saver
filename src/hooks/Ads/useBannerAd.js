import React from "react";
import AppLovinMax from "react-native-applovin-max";
import { StyleSheet, View } from "react-native";

const BannerID = "6598b7551db825ad";
export default ({ show = true, giveTopMargin = true }) => {
  if (show) {
    return (
      <View style={[styles.contain, giveTopMargin && styles.align_margin]}>
        <AppLovinMax.AdView
          adUnitId={BannerID}
          adFormat={AppLovinMax.AdFormat.BANNER}
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
    backgroundColor: "#000000",
    width: "100%",
    height: AppLovinMax.getAdaptiveBannerHeightForWidth(-1),
    alignSelf: "center",
  },
  contain: {
    zIndex: -10,
  },
});
