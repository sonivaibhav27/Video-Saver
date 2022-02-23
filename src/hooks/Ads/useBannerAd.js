import React from "react";
import {
  AdsConsentStatus,
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { StyleSheet, View } from "react-native";
import { Context } from "../../config";

const BannerID = "ca-app-pub-2540765935808056/2548345593";
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
          size={BannerAdSize.ADAPTIVE_BANNER}
          onAdFailedToLoad={(err) => {
            console.log(err);
          }}
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
