import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

//custom imports
import { Icons } from "../utils";

const PreviewVideoButton = ({
  url,
  textFontSize = 20,
  style,
  showIcon = false,
}) => {
  const navigation = useNavigation();
  const goToPreview = () => {
    if (url.length !== 0) {
      navigation.navigate("preview", { url });
    }
  };
  return (
    <TouchableOpacity
      onPress={goToPreview}
      style={[
        styles.container,
        {
          ...style,
        },
      ]}
      activeOpacity={1}
    >
      {showIcon ? (
        <Icons.Feather name="tv" size={16} color="white" />
      ) : (
        <View style={styles.buttonContainer}>
          <Icons.Feather name="tv" size={16} color="white" />
          <Text style={[styles.text, { fontSize: textFontSize }]}>
            Watch Video
          </Text>
        </View>
      )}
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
    backgroundColor: "rgba(0, 171, 102, 1)",
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
    marginLeft: 10,
  },
  buttonContainer: { flexDirection: "row", alignItems: "center" },
});
export default PreviewVideoButton;
