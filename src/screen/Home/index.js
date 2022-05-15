// CHECKED.

import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AdsHook } from "../../hooks";
import { Titles } from "../../config";
//custom imports;
import { DownloadButton, Header, IconButton } from "./components";

export default function App({ navigation, isPremiumUser }) {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.flex}>
        <View style={styles.iconContainer}>
          <IconButton
            onPress={() => {
              navigation.navigate("instagram");
            }}
            label={Titles.Instagram}
            iconName="instagram"
          />
          <IconButton
            backgroundColor="#1877F2"
            onPress={() => {
              navigation.navigate("facebook");
            }}
            iconName="Facebook"
            label={Titles.Facebook}
          />
          <IconButton
            backgroundColor="#1DA1F2"
            onPress={() => {
              navigation.navigate("twitter");
            }}
            iconName="Twitter"
            label={Titles.Twitter}
          />
          <IconButton
            onPress={() => {
              navigation.navigate("whatsapp");
            }}
            iconName="whatsapp"
            backgroundColor="#215C54"
            label={Titles.Whatsapp}
          />
          <IconButton
            onPress={() => {
              navigation.navigate("pinterest");
            }}
            backgroundColor="#fe3534"
            label={Titles.Pinterest}
            iconName="pinterest-with-circle"
          />
          <IconButton
            onPress={() => {
              navigation.navigate("vimeo");
            }}
            backgroundColor="#00adef"
            iconName="vimeo"
            label={Titles.Vimeo}
          />
        </View>
        <DownloadButton />
        {/* {!isPremiumUser && <PricingButton navigation={navigation} />} */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Now Share Whatsapp Status without {"\n"} downloading it. 😊
          </Text>
        </View>
      </View>
      <View style={styles.adBanner}>
        <AdsHook.BannerAd giveTopMargin={false} />
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
  infoContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  infoText: { textAlign: "center", fontWeight: "bold", color: "#000" },
  adBanner: { flex: 1, justifyContent: "flex-end" },
});
