import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
//custom imports
import { Toast } from "../../common";
import { Icons } from "../../utils";

export default () => {
  const navigation = useNavigation();
  const openLicensesInBrowser = (
    route = "https://vidown-64214.web.app/toc.html"
  ) => {
    Linking.openURL(route).catch((_) => {
      Toast("Can't open url at the moment.");
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
  const openToC = () => {
    openLicensesInBrowser();
  };

  const navigateToHelp = () => {
    navigation.navigate("help");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonContainer}
        onPress={navigateToHelp}
      >
        <Text style={styles.buttonText}>How to copy link?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.buttonContainer}
        onPress={openPrivacyPolicy}
      >
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openToC}
        activeOpacity={0.8}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Contact us</Text>
        <Text style={styles.mailUsText}>Mail at: Vidowndownload@gmail.com</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={openGooglePlay}
        style={[styles.buttonContainer, styles.ratingButtonContainer]}
      >
        <View style={styles.flexDirection}>
          {[1, 2, 3, 4, 5].map((key) => {
            return (
              <Icons.AntDesign
                name="star"
                key={key}
                size={20}
                color="#fdcc0d"
              />
            );
          })}
        </View>

        <Text style={styles.ratingUsText}>Rate us on Google Play</Text>
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
    backgroundColor: "#e7e7e7",
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
  ratingUsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 5,
  },
  mailUsText: { marginTop: 5, color: "#000", fontWeight: "bold" },
  ratingButtonContainer: { backgroundColor: "#000", alignItems: "center" },
  flexDirection: { flexDirection: "row" },
});
