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
import { Icons, QonversionInApp } from "../../utils";
import { PRIVACY_POLICY } from "../../config";

const ICON_SIZE = 25;

const Button = ({ onPress, text, icon }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      style={styles.buttonContainer}
      onPress={onPress}
    >
      {icon !== undefined && icon}
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

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
    openLicensesInBrowser(PRIVACY_POLICY);
  };

  const openGooglePlay = () => {
    try {
      Linking.openURL("market://details?id=com.vidownranuja");
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

  const restorePurchase = () => {
    QonversionInApp.restorePayment();
  };

  return (
    <View style={styles.container}>
      {/* <Button
        onPress={restorePurchase}
        text="Restore Purchases"
        icon={<Icons.Entypo name="lock" color="#000" size={ICON_SIZE} />}
      /> */}
      <Button
        onPress={navigateToHelp}
        text="How to copy link?"
        icon={<Icons.AntDesign name="copy1" color="#000" size={ICON_SIZE} />}
      />
      <Button
        onPress={() => {}}
        text="Vidowndownload@gmail.com"
        icon={<Icons.AntDesign name="mail" color="#000" size={ICON_SIZE} />}
      />
      <Button
        onPress={openPrivacyPolicy}
        text="Privacy Policy"
        icon={
          <Icons.Entypo name="text-document" color="#000" size={ICON_SIZE} />
        }
      />
      <Button
        onPress={openToC}
        text="Terms of Service"
        icon={
          <Icons.Entypo name="text-document" color="#000" size={ICON_SIZE} />
        }
      />

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
    borderColor: "#eee",
    padding: 15,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
  },
  buttonText: {
    color: "#333",
    marginLeft: 10,
  },
  ratingUsText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 5,
  },
  ratingButtonContainer: {
    backgroundColor: "#000",
    alignItems: "center",
    flexDirection: "column",
  },
  flexDirection: { flexDirection: "row" },
});
