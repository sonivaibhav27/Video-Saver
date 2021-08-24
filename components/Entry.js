// CHECKED.

import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import HeaderTitle from "./HeaderTitle/index";
import {
  IconDisplay,
  ImageIcon,
  InstagramIcon,
} from "./SocialMedia/LogoIcons/index";
import Settings from "./Setting/Settings";

import { BannerAd } from "@react-native-firebase/admob";
import { AD_SIZE, BannerID } from "./RemoveAds/InitializeAd";

export default function App({ navigation }) {
  const navigateToDownload = () => {
    navigation.navigate("Downloads");
  };
  return (
    <View style={styles.container}>
      <HeaderTitle />

      <View style={styles.flex}>
        <View style={styles.iconContainer}>
          <InstagramIcon navigation={navigation} text="Instagram" />
          <IconDisplay
            backgroundColor="#4267B2"
            onPress={() => {
              navigation.navigate("Detail", {
                platform: "fb",
                name: "Facebook",
              });
            }}
            isfb
            name="facebook-f"
            text="Facebook"
          />
          <IconDisplay
            backgroundColor="#1DA1F2"
            onPress={() => {
              navigation.navigate("Detail", {
                name: "twitter",
                platform: "twitter",
              });
            }}
            isTw
            name="twitter"
            text="Twitter"
          />
          <IconDisplay
            onPress={() => {
              navigation.navigate("whatsapp");
            }}
            isWp
            name="whatsapp"
            backgroundColor="#075e54"
            text="Whatsapp"
          />
          <ImageIcon
            onPress={() => {
              navigation.navigate("pin");
            }}
            backgroundColor="#fe3534"
            text="Pinterest"
          />
          <ImageIcon
            onPress={() => {
              navigation.navigate("vimeo");
            }}
            isVimeo
            backgroundColor="#00adef"
            text="Vimeo"
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Now Share Whatsapp Status without {"\n"} downloading it. 😊
          </Text>
        </View>

        <TouchableOpacity
          onPress={navigateToDownload}
          activeOpacity={0.9}
          style={styles.yourDownloads}
        >
          <Text style={styles.yourDownloadsText}>Downloads</Text>
        </TouchableOpacity>
        <Settings />
        {/* <Text style={{ textAlign: "center", fontWeight: "700", paddingTop: 5 }}>
          Version:Test Version 1.0
        </Text> */}
      </View>
      <View>
        <BannerAd
          unitId={BannerID}
          onAdFailedToLoad={() => {}}
          size={AD_SIZE.SMART_BANNER}
          key="Banner Ads"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1.2,
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  yourDownloads: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#262626",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  yourDownloadsText: {
    color: "#FFF",
    fontSize: 18,
  },
  infoContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  infoText: { textAlign: "center", fontWeight: "bold", color: "#000" },
});
