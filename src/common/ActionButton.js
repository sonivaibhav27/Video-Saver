import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

//custom imports;
import { Icons } from "../utils";
import PasteButton from "./PasteButton";

const ActionButtons = ({
  condition,
  urlLink,
  onGetLinkPress,
  onPasteClicked,
  whenToShowLoadingIndicator,
}) => {
  return (
    <View style={styles.pasteAndGetButtonContainer}>
      <PasteButton onPress={onPasteClicked} />
      {condition ? (
        <TouchableOpacity
          style={styles.flex1}
          activeOpacity={0.8}
          onPress={onGetLinkPress}
          disabled={!urlLink.length}
        >
          <View
            style={[
              styles.buttonTextContainer,
              //eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor: urlLink ? "#2d2e2f" : "rgba(45, 46, 47,0.3)",
              },
            ]}
          >
            {whenToShowLoadingIndicator ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.getLinkText}>Get Link</Text>
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.flex1}
          activeOpacity={0.8}
          disabled={true}
        >
          <View
            style={[
              styles.buttonTextContainer,
              styles.fetchVideoButtonContainer,
            ]}
          >
            <Text style={styles.fetchText}>Fetched</Text>
            <Icons.AntDesign
              name="checkcircle"
              /* eslint-disable-next-line react-native/no-inline-styles */
              style={{ marginLeft: 10 }}
              size={20}
              color={"#fff"}
            />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pasteAndGetButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 10,
  },
  buttonTextContainer: {
    padding: 10,

    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  flex1: {
    flex: 1,
  },

  fetchVideoButtonContainer: {
    backgroundColor: "#4bb543",
    flexDirection: "row",
    alignItems: "center",
  },

  fetchText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  getLinkText: { fontSize: 18, color: "#f1f1f1" },
});

export default ActionButtons;
