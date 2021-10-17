import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";

//custom imports;
import { Download, Icons } from "../../../utils";
import {
  PreviewVideoButton,
  Toast,
  WatchVideoToDownload,
} from "../../../common";

const { height } = Dimensions.get("window");
const DownloadModalForDifferentVideoResolutions = ({
  data,
  hideModal,
  posterImage,
  isPremiumUser,
  getFileForShare,
  adsConsentStatus,
}) => {
  const downloadVimeo = (url) => {
    Toast("Download Started", "LONG");
    hideModal();
    Download(url, (file) => {
      getFileForShare(file);
    });
  };
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.foundMultipleTypeText}>Found Multiple Type</Text>
      <Text style={styles.moreInternetText}>
        *more quality video takes more internet
      </Text>
      <ScrollView style={styles.flex1} keyboardShouldPersistTaps="handled">
        {data.map((item, index) => {
          return (
            <View key={index} style={styles.rowContainer}>
              <View key={index} style={styles.rowSubContainer}>
                <View style={styles.flexRowAndAlignCenter}>
                  <Image
                    source={{ uri: posterImage }}
                    style={styles.posterImageStyle}
                  />
                  <View style={styles.margin5}>
                    <View style={styles.flexRowAndAlignCenter}>
                      <Text style={styles.videoQualityText}>{item.q}</Text>
                      {item.q >= 720 && <Text style={styles.hdTag}>HD</Text>}
                    </View>
                    <Text style={styles.videoWidthAndHeightText}>
                      {item.width} x {item.height}
                    </Text>
                  </View>
                </View>
                <View style={styles.flexRowAndAlignCenter}>
                  <PreviewVideoButton
                    style={styles.previewButtonStyle}
                    url={item.url}
                    textFontSize={16}
                    showIcon={true}
                  />
                  {item.q >= 720 ? (
                    <WatchVideoToDownload.AdButton
                      adConsentStatus={adsConsentStatus}
                      showIconOnly
                      url={item.url}
                      isPremiumUser={isPremiumUser}
                      getFileForShare={getFileForShare}
                      hideAllDownloadButtons={hideModal}
                    />
                  ) : (
                    <TouchableOpacity
                      hitSlop={{
                        bottom: 5,
                        top: 5,
                        left: 5,
                        right: 5,
                      }}
                      style={styles.downloadButtonContainer}
                      onPress={() => downloadVimeo(item.url)}
                    >
                      <Icons.AntDesign
                        name="download"
                        size={16}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    elevation: 10,
    maxHeight: height * 0.7,
  },
  foundMultipleTypeText: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  moreInternetText: { fontWeight: "600", fontSize: 14, textAlign: "center" },
  rowContainer: {
    marginHorizontal: 10,
    marginVertical: 4,
    borderBottomWidth: 1,
    padding: 5,
    borderBottomColor: "#eee",
  },
  rowSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexRowAndAlignCenter: { flexDirection: "row", alignItems: "center" },
  posterImageStyle: { height: 50, width: 50, borderRadius: 5 },
  videoQualityText: { fontWeight: "800", fontSize: 18 },
  margin5: { marginLeft: 5 },
  flex1: { flex: 1 },
  videoWidthAndHeightText: { fontWeight: "600" },
  downloadButtonContainer: {
    padding: 10,
    backgroundColor: "#000",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  previewButtonStyle: {
    padding: 10,
    flex: 0,
    marginBottom: 0,
    marginRight: 10,
    zIndex: 1000,
  },
  hdTag: {
    marginLeft: 5,
    backgroundColor: "#4e28a6",
    padding: 4,
    color: "#fff",
    borderRadius: 4,
  },
});
export default DownloadModalForDifferentVideoResolutions;
