import React from "react";
import {
  AdsConsentStatus,
  BannerAd,
  BannerAdSize,
  TestIds,
} from "@react-native-firebase/admob";
import { StyleSheet, View } from "react-native";
import { Context } from "../../config";

const BannerID = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-2540765935808056/2548345593";
export default ({ show = true }) => {
  const adConsumer = React.useContext(Context.AdsConsentContext);
  console.log({
    adConsumer,
  });
  if (show && adConsumer !== null && adConsumer !== AdsConsentStatus.UNKNOWN) {
    return (
      <View style={styles.align_margin}>
        <BannerAd
          unitId={BannerID}
          size={BannerAdSize.MEDIUM_RECTANGLE}
          requestOptions={{
            requestNonPersonalizedAdsOnly:
              AdsConsentStatus.NON_PERSONALIZED === adConsumer,
          }}
        />
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  align_margin: { alignItems: "center", marginTop: 20 },
});
