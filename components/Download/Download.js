import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  PermissionsAndroid,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import Toast from "../Toast";
import DownloadHelper from "../Download.helper";

class Download extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: "Download Video",
    };
    this._isMounted = true;
  }
  componentWillUnmount() {
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
    DownloadHelper(
      this.props.url,
      () => {
        this.props.getFileForShare(fileName);
        if (this._isMounted) {
          this.setState({ text: "Downloaded" });
        }
      },
      () => {
        if (this._isMounted) {
          Alert.alert("Error", "Something went wrong while downloading video");
          this.setState({ text: "Download" });
        }
      }
    );
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
