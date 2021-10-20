import React from "react";
import {
  StyleSheet,
  Text,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";

//custom imports.
import { Icons, Download } from "../utils";
import Toast from "./Toast";
import { AdsHook } from "../hooks";
import { Context } from "../config";
class VideoDownloadButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: "Download",
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
    if (!this.props.isPremiumUser && this.props.isUserConsentAvaialable) {
      try {
        this.props.showAd();
      } catch (err) {}
    }
    this.setState({ text: "Downloading..." });
    Download(
      this.props.url,
      (fileName) => {
        if (this._isMounted) {
          this.setState({ text: "Downloaded" }, () => {
            this.props.getFileForShare(fileName);
          });
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
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={
          this.props.url === undefined ||
          this.state.text === "Downloaded" ||
          this.state.text === "Downloading..."
        }
        onPress={
          this.state.text === "Downloaded"
            ? () => {
                Toast("Already Downloaded");
              }
            : this.checkPermission
        }
        style={[
          styles.container,
          // eslint-disable-next-line  react-native/no-inline-styles
          {
            backgroundColor:
              this.props.url === undefined ? "rgba(0,0,0,0.3)" : "#333",
          },
        ]}
      >
        <Icons.AntDesign name="download" size={16} color="white" />
        <Text style={styles.textStyle}>{this.state.text}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    maxWidth: 350,
    flexDirection: "row",
    flex: 1,
  },
  textStyle: { color: "#fff", fontSize: 20, marginLeft: 10 },
});

export default (props) => {
  const interestialAd = AdsHook.useInterestitialAd();

  const adsConsent = React.useContext(Context.AdsConsentContext);
  React.useEffect(() => {
    let event;
    if (!props.isPremiumUser && adsConsent != null && adsConsent != 0) {
      interestialAd.interestitialModifiedForEEA(adsConsent);
      interestialAd.loadAd();
      event = interestialAd.eventHandler(() => {
        // interestialAd.showAd();
      });
    }

    return () => {
      if (typeof event !== "undefined") {
        event();
      }
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VideoDownloadButton
      {...props}
      isUserConsentAvaialable={adsConsent != null && adsConsent != 0}
      showAd={interestialAd.showAd}
    />
  );
};
