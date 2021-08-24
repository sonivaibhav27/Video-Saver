import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";

const ShowPermissionScreen = ({ onPress }) => {
  const userAgreeToGrantPermission = () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ).then((value) => {
      if (value) {
        // navigation.navigate("Entry");
        onPress();
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            message:
              "Please Grant Permission to download wonderful status and videos.",
            title: "Grant Permission",
          }
        ).then((permssion) => {
          console.log(permssion);
          if (permssion === "granted") {
            onPress();
          } else if (permssion === "never_ask_again") {
            Alert.alert(
              "Need Permissions",
              "Video Saver Needs permissions to dive you on the board.",
              [
                {
                  text: "Ok",
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
          }
        });
      }
    });
  };
  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text style={styles.titleText}>First Things First</Text>
          <Text style={styles.otherInfoText}>
            Needs permissions to download file, Please accept the permission
          </Text>
          <View style={styles.marginTop}>
            <Text style={styles.storageText}>Storage</Text>
            <Text style={styles.otherInfoText}>
              We need these permission to download files.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={userAgreeToGrantPermission}
          style={styles.continueContainer}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titleText: { color: "#222", fontSize: 22, fontWeight: "bold" },

  marginTop: { marginTop: 20 },
  storageText: { fontSize: 20, fontWeight: "600", color: "#333" },
  otherInfoText: { fontSize: 16, color: "#333", marginTop: 20 },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
  },
  continueContainer: {
    backgroundColor: "#222",
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: { fontSize: 20, color: "#fff" },
});

export default ShowPermissionScreen;
