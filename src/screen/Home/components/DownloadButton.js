import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";

export default () => {
  const navigation = useNavigation();
  const navigatToDownload = () => {
    navigation.navigate("downloads");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={navigatToDownload} style={styles.btnContainer}>
        <Text style={styles.btnText}> Downloads </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  btnContainer: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    elevation: 2,
    marginHorizontal: 10,
  },
  btnText: { fontSize: 20, color: "#000", fontWeight: "700" },
});
