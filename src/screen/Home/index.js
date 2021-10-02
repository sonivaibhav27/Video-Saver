// CHECKED.

import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

//custom imports;
import { DownloadButton, Header, IconButton } from "./components";

export default function App({ navigation }) {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.flex}>
        <View style={styles.iconContainer}>
          <IconButton
            onPress={() => {
              navigation.navigate("instagram");
            }}
            label="instagram"
            iconName="instagram"
          />
          <IconButton
            backgroundColor="#4267B2"
            onPress={() => {
              navigation.navigate("facebook");
            }}
            iconName="facebook-f"
            label="facebook"
          />
          <IconButton
            backgroundColor="#1DA1F2"
            onPress={() => {
              navigation.navigate("twitter");
            }}
            iconName="twitter"
            label="twitter"
          />
          <IconButton
            onPress={() => {
              navigation.navigate("whatsapp");
            }}
            iconName="whatsapp"
            backgroundColor="#075e54"
            label="whatsapp"
          />
          <IconButton
            onPress={() => {
              navigation.navigate("pinterest");
            }}
            backgroundColor="#fe3534"
            label="pinterest"
            iconName="pinterest"
          />
          <IconButton
            onPress={() => {
              navigation.navigate("vimeo");
            }}
            backgroundColor="#00adef"
            iconName="vimeo"
            label="vimeo"
          />
        </View>
        <DownloadButton />
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Now Share Whatsapp Status without {"\n"} downloading it. 😊
          </Text>
        </View>
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
});
