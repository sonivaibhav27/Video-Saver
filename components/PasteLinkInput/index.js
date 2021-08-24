import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";

const PasteLinkInput = ({ onCrossClicked, ...props }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <View style={styles.sub}>
      <Icon style={{ marginRight: 5 }} name="link" size={30} color="#333" />
      <TextInput
        showSoftInputOnFocus={false}
        placeholder="Paste your link here"
        {...props}
        style={styles.textInput}
      />

      {props.value.length != 0 && (
        <TouchableOpacity
          onPress={onCrossClicked}
          activeOpacity={0.9}
          style={{ marginRight: 3 }}
          hitSlop={{
            left: 5,
            right: 5,
            bottom: 5,
            top: 5,
          }}
        >
          <Entypo color={"#555"} name="circle-with-cross" size={25} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  sub: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderColor: "#eee",
    flex: 1,
  },
  textInput: {
    padding: 10,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: "#666",
    fontSize: 18,
    flex: 1,
  },
});
export default PasteLinkInput;
