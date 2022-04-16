import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import ApplovinMax from "react-native-applovin-max";

const ConsentModal = ({ setState }) => {
  const onYesPress = () => {
    ApplovinMax.setHasUserConsent(true);
    setState(true);
  };
  const onNoPress = () => {
    ApplovinMax.setHasUserConsent(false);
    setState(true);
  };
  const onPrivacyLinkClick = () => {
    if (Linking.canOpenURL("https://ranuja-apps.github.io/")) {
      Linking.openURL("https://ranuja-apps.github.io/").catch((err) => {});
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.info}>
          Can we continue to use your data to tailor ads for you?
        </Text>
        <Text style={styles.big}>
          We care about your privacy and security.We keeps this app by showing
          ads.
        </Text>
        <Text style={[styles.info, styles.infoDetail]}>
          Our Ads Partner may collect your personal data such as device
          identifiers, location data and other demographic interest to show you
          relevant ads.
        </Text>
        <View>
          <TouchableOpacity
            onPress={onYesPress}
            style={[styles.common, styles.yes]}
          >
            <Text style={styles.yesText}>
              Yes, Continue to use personalized ads
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNoPress}
            style={[styles.common, styles.no]}
          >
            <Text style={styles.noText}>
              No, Continue to use non personalized ads
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {/* eslint-disable-next-line react-native/no-raw-text */}
          <Text style={styles.privacyPolicy}>
            Learn more at :
            <Text style={styles.link} onPress={onPrivacyLinkClick}>
              {" "}
              Our Privacy Policy{" "}
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modal: {
    padding: 10,
    elevation: 3,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    // margin: 20,
  },
  info: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    fontWeight: "700",
  },
  big: {
    fontSize: 17,
    color: "#111",
    marginVertical: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoDetail: {
    textAlign: "left",
    fontWeight: "400",
  },
  common: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  yes: {
    backgroundColor: "#e95950",
    marginTop: 20,
  },
  yesText: {
    color: "#fff",
    fontSize: 15.5,
    fontWeight: "600",
  },
  noText: {
    color: "#333",
  },
  privacyPolicy: {
    textAlign: "center",
    marginTop: 10,
    color: "#222",
  },
  link: {
    color: "#E91E63",
    textDecorationLine: "underline",
  },
});

const useAdsConsentHook = ({ setState }) => {
  return <ConsentModal setState={setState} />;
};

export default useAdsConsentHook;
