import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Icons } from "../../../utils";
export default ({ navigation }) => {
  const navigateToBuyPremium = () => {
    navigation.navigate("pricingModal");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={navigateToBuyPremium}
        style={styles.btnContainer}
      >
        <Icons.FontAwesome name="diamond" size={20} color={"#fff"} />
        <View style={styles.marginLeft}>
          <Text style={styles.btnText}>Buy Premium</Text>
        </View>
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
    backgroundColor: "#E2306C",
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    elevation: 2,
    marginHorizontal: 10,
    flexDirection: "row",
  },
  btnText: { fontSize: 20, color: "#fff", fontWeight: "bold", marginLeft: 10 },
});
