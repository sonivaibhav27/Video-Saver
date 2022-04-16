import React, { PureComponent } from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
//custom imports
import { Icons } from "../../../utils";
import { saveStatus, ShareWhatsappStatus } from "../helper";
import { Toast } from "../../../common";

const { width, height } = Dimensions.get("window");

function returnPath(dir, item) {
  if (Platform.Version >= 30) {
    return (
      "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses/document/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses%2F" +
      item
    );
  }
  return `file://${dir}/${item}`;
}
export default class WhatsappSection extends PureComponent {
  constructor(props) {
    super(props);
  }
  share = async () => {
    this.props.onSharePressed();
    await ShareWhatsappStatus(
      returnPath(this.props.dir, this.props.item),
      this.props.type
    );
    this.props.shareDone();
  };

  render() {
    const { dir, type, item } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          {type === "image" ? (
            <Image
              style={styles.imageStyle}
              source={{ uri: returnPath(dir, item) }}
            />
          ) : (
            <View style={styles.flex}>
              <Image
                source={{ uri: returnPath(dir, item) }}
                style={styles.imageStyle}
                resizeMode="cover"
              />
              <View style={styles.positionVideoCaret}>
                <View style={styles.videoCaretContainer}>
                  <Icons.AntDesign name="caretright" color={"#fff"} size={40} />
                </View>
              </View>
            </View>
          )}
        </View>
        <View style={styles.actionContainer}>
          <TouchableOpacity activeOpacity={0.8} onPress={this.share}>
            <View style={styles.shareContainer}>
              <Icons.AntDesign size={20} color="#fff" name="sharealt" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              saveStatus(
                returnPath(dir, item),
                (destination, error) => {
                  if (error) {
                    Toast("Error: " + error);
                    return;
                  }
                  Toast(`File saved : ${destination}`);
                },
                type
              );
            }}
          >
            <View style={styles.downloadIconContainer}>
              <Icons.MaterialCommunityIcons
                name="download"
                size={20}
                color={"#fff"}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const commonStyle = {
  elevation: 5,
  height: 50,
  width: 50,
  borderRadius: 50,
  justifyContent: "center",
  alignItems: "center",
};
const styles = StyleSheet.create({
  downloadIconContainer: {
    ...commonStyle,
    backgroundColor: "#075e54",
  },
  shareContainer: {
    ...commonStyle,
    backgroundColor: "#000",
  },
  actionContainer: {
    position: "absolute",
    bottom: 5,
    right: 5,
    flexDirection: "row",
    left: 5,
    justifyContent: "space-between",
  },
  videoCaretContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 100,
  },
  positionVideoCaret: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: { flex: 1, backgroundColor: "#ccc" },
  flex: { flex: 1 },
  mainContainer: {
    width: width / 2.2,
    height: height * 0.3,
    backgroundColor: "#000",
  },
  container: {
    marginBottom: 5,
    marginRight: 5,
    borderRadius: 10,
    overflow: "hidden",
    // flex: 1,
  },
});
