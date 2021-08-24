import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Feather from "react-native-vector-icons/Feather";
const PreviewButton = ({ url, textFontSize = 20, style, showIcon = false }) => {
  const navigation = useNavigation();
  const goToPreview = () => {
    if (url.length != 0) {
      navigation.navigate("Preview", { url });
    }
  };
  return (
    <TouchableOpacity
      onPress={goToPreview}
      style={[
        {
          backgroundColor: "rgba(0, 171, 102, 1)",
          borderRadius: 100,
        },
        styles.container,
        {
          ...style,
        },
      ]}
      activeOpacity={1}
    >
      {/* <View style={styles.container}> */}
      {showIcon ? (
        <Feather name="tv" size={16} color="white" />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather name="tv" size={16} color="white" />
          <Text style={[styles.text, { fontSize: textFontSize }]}>
            Watch Video
          </Text>
        </View>
      )}
      {/* </View> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    marginBottom: 15,
    maxWidth: 350,
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
  },
});
export default PreviewButton;
