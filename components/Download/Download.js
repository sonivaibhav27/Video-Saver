import CameraRoll from "@react-native-community/cameraroll";
import React from "react";
import {
  View,
  StyleSheet,
  ToastAndroid,
  Text,
  Alert,
  PermissionsAndroid,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import RNFetchBlob from "rn-fetch-blob";
import { interstitial, AdEvent } from "../RemoveAds/InitializeAd";
import Toast from "../Toast";

import { Client } from "rollbar-react-native";
const rollbar = new Client("bc7677e227ef4846bcb1633b09b0180c");

class Download extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: "Download Video",
    };
    this._isMounted = true;
  }
  componentDidMount = () => {
    interstitial.load();
    this.showAds;
  };
  componentWillUnmount() {
    this.showAds && this.showAds();
    this._isMounted = false;
  }

  checkPermission = () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
      .then((granted) => {
        if (granted) {
          this.downloadVideo();
        } else {
          Toast("Please give storage permission to download.");
        }
      })
      .catch((_) => {
        Toast("Failed to check permssion.");
      });
  };
  downloadVideo = async () => {
    this.setState({ text: "Downloading..." });
    this.showAds = interstitial.onAdEvent((type) => {
      if (type == AdEvent.LOADED) {
        interstitial.show();
      } else if (type == AdEvent.ERROR) {
      }
    });
    const date = new Date();
    const fileName =
      date.toDateString() + date.getMilliseconds() + date.getTime();

    RNFetchBlob.config({
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          RNFetchBlob.fs.dirs.MovieDir + "/Video Saver/" + `${fileName}.mp4`,
      },
    })
      .fetch("GET", this.props.url, { "Cache-Control": "no-store" })
      .then(async (res) => {
        // the temp file path with file extension `png`
        ToastAndroid.showWithGravityAndOffset(
          `File Saved: ${res.path()}`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          10
        );
        this.props.getFileForShare(fileName);
        if (this._isMounted) {
          this.setState({ text: "Downloaded" });
        }
      })
      .catch((_) => {
        rollbar.warning(this.props.url);
        console.log(_);
        if (this._isMounted) {
          Alert.alert("Error", "Something went wrong while downloading video");
          this.setState({ text: "Download" });
        }
      });
  };
  render() {
    return (
      <React.Fragment>
        <TouchableNativeFeedback
          disabled={
            this.props.url === undefined ||
            this.state.text === "Downloaded" ||
            this.state.text === "Downloading..."
          }
          onPress={
            this.state.text === "Downloaded"
              ? () => {
                  alert("Already Downloaded");
                }
              : this.checkPermission
          }
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor:
                  this.props.url === undefined ? "rgba(0,0,0,0.3)" : "#333",
              },
            ]}
          >
            <AntDesign name="download" size={16} color="white" />
            <Text style={{ color: "#fff", fontSize: 20, marginLeft: 10 }}>
              {this.state.text}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </React.Fragment>
    );
  }
}

export default Download;
const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: 350,
    flexDirection: "row",
  },
});
