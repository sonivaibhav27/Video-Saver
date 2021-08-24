/* eslint-disable react-native/no-inline-styles */
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Share from "react-native-share";
import Toast from "../Toast";
import RNFetchBlob from "rn-fetch-blob";
import CameraRoll from "@react-native-community/cameraroll";

const ShareModal = ({ closeModal, url }) => {
  const shareStories = async () => {
    try {
      await Share.shareSingle({
        social: Share.Social.INSTAGRAM,
        url: url,
        forceDialog: true,
        type: "video/mp4",
      }).catch((err) => {
        console.log(err);
        if (error.message === "User did not share") {}
        else if (
          err.error ===
          "No Activity found to handle Intent { act=com.instagram.share.ADD_TO_STORY typ=video/mp4 flg=0x10000001 pkg=com.instagram.android (has extras) }"
        ) {
          Toast("Instagram Not Found");
        } else {
          Toast("Can't able to share, Size of video may be big.");
        }
      });
      // CameraRoll.deletePhotos([path]);
    } catch (err) {
      console.log(err);
      return;
    }

    closeModal();
  };

  const normalShare = () => {
    Share.open({
      url,
      type: "video/mp4",
      excludedActivityTypes: ["pinterest.ShareExtension"],
    }).catch((err) => {
      if (error.message === "User did not share") {
      } else if (
        err.error ===
        "No Activity found to handle Intent { act=com.instagram.share.ADD_TO_STORY typ=video/mp4 flg=0x10000001 pkg=com.instagram.android (has extras) }"
      ) {
        Toast("Instagram Not Found");
      } else {
        Toast("Can't able to share, Size of video may be big.");
      }
    });
    closeModal();
  };
  const whatsappShare = () => {
    Share.shareSingle({
      url,
      social: Share.Social.WHATSAPP,
      forceDialog: true,
    })
      .then((value) => {
        console.log(value);
      })
      .catch((err) => {
        if (error.message === "User did not share") {}
        else if (
          err.error ===
          "No Activity found to handle Intent { act=com.instagram.share.ADD_TO_STORY typ=video/mp4 flg=0x10000001 pkg=com.instagram.android (has extras) }"
        ) {
          Toast("Instagram Not Found");
        } else {
          Toast("Can't able to share, Size of video may be big.");
        }
      });
    closeModal();
  };
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <Text style={styles.shareText}>Share</Text>
        <View style={styles.shareOptionsContainer}>
          <TouchableOpacity onPress={shareStories} style={{}}>
            <View style={styles.shareIconContainer}>
              <AntDesign size={30} color="#FFF" name="instagram" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={whatsappShare} style={{}}>
            <View
              style={[
                styles.shareIconContainer,
                { backgroundColor: "#075e54" },
              ]}
            >
              <FontAwesome size={30} color="#FFF" name="whatsapp" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={normalShare}>
            <View
              style={[styles.shareIconContainer, { backgroundColor: "#000" }]}
              activeOpacity={0.8}
            >
              <Entypo style={{}} size={30} color="#FFF" name="share" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.marginTop}>
          <TouchableOpacity
            onPress={() => closeModal()}
            style={styles.cancelContainer}
          >
            <Text style={{ color: "#444" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  mainContainer: {
    backgroundColor: "#fff",
    borderRadius: 2,
    padding: 10,
  },
  shareText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#262626",
    textAlign: "center",
    textTransform: "uppercase",
  },
  shareOptionsContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  shareIconContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1306c",
    borderRadius: 50,
    width: 50,
  },
  marginTop: {
    marginTop: 20,
  },
  cancelContainer: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ShareModal;
