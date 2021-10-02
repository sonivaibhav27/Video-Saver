import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

//custom imports
import { HelpPage, Button } from "./components";
import { Icons } from "../../utils";

const CopyLinkData = {
  facebook: {
    image: require("../../assets/facebook.jpeg"),
    name: "facebook",
  },
  twitter: {
    image: require("../../assets/twitter.jpeg"),
    name: "twitter",
  },
  pinterest: {
    image: require("../../assets/pin.jpeg"),
    name: "pinterest",
  },
  instagram: {
    image: require("../../assets/insta.jpeg"),
    name: "instagram",
  },
};

const HelpScreen = () => {
  const [data, setData] = React.useState(null);
  const navigation = useNavigation();
  const [showModal, setShowModal] = React.useState(false);
  const onPress = React.useCallback((label) => {
    setData(CopyLinkData[label]);
    setShowModal(true);
  }, []);
  const closeModalHandler = React.useCallback(() => {
    setShowModal(false);
  }, []);
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          activeOpacity={0.8}
          hitSlop={{
            right: 5,
            left: 5,
            top: 5,
            bottom: 5,
          }}
        >
          <Icons.AntDesign name="arrowleft" size={25} color="#000" />
        </TouchableOpacity>
        <Text style={styles.helpText}>How to copy link?</Text>
      </View>
      <Button onPress={onPress} label="instagram" />
      <Button onPress={onPress} label="facebook" />
      <Button onPress={onPress} label="pinterest" />
      <Button onPress={onPress} label="twitter" />
      {showModal && <HelpPage data={data} closeModal={closeModalHandler} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  helpText: {
    marginLeft: 35,
    fontSize: 18,
    fontWeight: "700",
  },
});

export default HelpScreen;
