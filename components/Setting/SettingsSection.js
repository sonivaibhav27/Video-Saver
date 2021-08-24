import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ToastAndroid,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

export default () => {
  const openLicensesInBrowser = (
    undefined,
    route = "https://vidown-64214.web.app/toc.html"
  ) => {
    Linking.openURL(route).catch((_) => {
      ToastAndroid.showWithGravityAndOffset(
        "Can't open url at the moment.",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        0,
        20
      );
    });
  };

  const openPrivacyPolicy = () => {
    openLicensesInBrowser(undefined, "https://ranuja-apps.github.io/");
  };

  const openGooglePlay = () => {
    try {
      Linking.openURL("market://details?id=com.vidown");
    } catch (error) {
      Alert.alert("Error", "Failed to open google play");
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonContainer}
        onPress={openPrivacyPolicy}
      >
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openLicensesInBrowser}
        activeOpacity={0.8}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Contact us</Text>
        <Text style={{ marginTop: 5, color: "#000", fontWeight: "bold" }}>
          Mail at: Vidowndownload@gmail.com
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openGooglePlay}
        style={[
          styles.buttonContainer,
          { backgroundColor: "#000", alignItems: "center" },
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <Icon name="star" size={20} color="#fdcc0d" />
          <Icon name="star" size={20} color="#fdcc0d" />
          <Icon name="star" size={20} color="#fdcc0d" />
          <Icon name="star" size={20} color="#fdcc0d" />
          <Icon name="star" size={20} color="#fdcc0d" />
        </View>

        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            marginLeft: 5,
          }}
        >
          Rate us on Google Play
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#fff",
            textAlign: "center",
            textTransform: "capitalize",
          }}
        >
          your rating helps us a lot to get new downloads, If found this app
          useful please take a min to review the app
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#eee",
    padding: 10,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#333",
  },
});
