import { useNavigation } from "@react-navigation/core";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
export default ({ showRewardAlertCallback }) => {
  const navigation = useNavigation();
  const goToHelp = () => {
    navigation.navigate("Help");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        hitSlop={{ left: 5, right: 5, top: 5, bottom: 5 }}
        activeOpacity={0.8}
        onPress={showRewardAlertCallback}
      >
        <Image style={styles.image} source={require("../assets/love.png")} />
      </TouchableOpacity>
      <View>
        <Text style={styles.headerTitle}>
          <Text style={styles.VITextStyle}>Video</Text>Saver
        </Text>
        <Text style={styles.subText}>All social media downloader</Text>
      </View>

      <View>
        <TouchableOpacity
          onPress={goToHelp}
          activeOpacity={0.8}
          hitSlop={{
            bottom: 5,
            top: 5,
            left: 5,
            right: 5,
          }}
        >
          <Entypo name="help-with-circle" size={30} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
    marginBottom: 20,
    flexDirection: "row",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#4267B2",
    fontFamily: "Roboto",
    textAlign: "center",
  },
  VITextStyle: { color: "purple", textAlign: "center" },
  subText: {
    fontSize: 14,
    color: "#555",
  },
  image: {
    width: 30,
    height: 30,
  },
});
