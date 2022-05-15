import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

//custom imports;
import { Icons } from "../../../utils";

const { height } = Dimensions.get("window");
const InstagramLoginInfoModal = ({ onPress, cancelLogin }) => (
  <View style={styles.instaWarningContainer}>
    <Text style={styles.instaText}>
      We never save your username and password, you will be redirected to
      OFFICIAL login page.
    </Text>
    <View style={styles.actionContainer}>
      <TouchableOpacity onPress={onPress} style={styles.instaBtnContainer}>
        {/* <Icons.AntDesign name="instagram" size={30} color="#fff" /> */}
        <Text style={styles.loginText}>Continue to login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.instaBtnContainer, styles.cancelContainer]}
        onPress={cancelLogin}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  instaWarningContainer: {
    position: "absolute",
    elevation: 4,
    backgroundColor: "#FFF",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 10,
  },
  instaText: {
    fontSize: 13,
    color: "#000",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "700",
  },
  instaBtnContainer: {
    padding: 10,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    flexDirection: "row",
  },
  cancelText: {
    color: "#222",
    fontSize: 16,
  },
  loginText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 18,
  },
  actionContainer: { flex: 1, justifyContent: "center" },
  cancelContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 20,
  },
});

export default InstagramLoginInfoModal;
