import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const Section = ({ label, image, index }) => {
  return (
    <View style={styles.padding10}>
      <View style={styles.headerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.bulletPoint}>{index}</Text>
        </View>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Image source={image} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    backgroundColor: "#1a428a",
    borderRadius: 15,
    padding: 6,
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bulletPoint: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    height: 200,
    width: width,
    alignSelf: "center",
    marginTop: 10,
    maxWidth: 400,
  },
  padding10: {
    padding: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  labelText: {
    fontSize: 14,
    color: "#222",
    textTransform: "capitalize",
    fontWeight: "600",
    // textAlign: "center",
    marginRight: 20,
  },
});

export default Section;
