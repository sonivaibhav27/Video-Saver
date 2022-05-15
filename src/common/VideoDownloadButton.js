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

  componentDidUpdate(prevProps) {
    if (prevProps.adHidden !== this.props.adHidden && this.props.adHidden) {
      this.downloadVideo();
    }
  }
  checkPermission = () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
      .then((granted) => {
        if (granted) {
          this.showAdOrDownloadVideo();
        } else {
          Toast("Please give storage permission to download.");
        }
      })
      .catch((_) => {
        console.log(_);
        Toast("Failed to check permssion.");
      });
  };

  showAdOrDownloadVideo = () => {
    if (this.props.isSanitizedInterstitialAdLoaded()) {
      this.props.showAd();
    } else {
      this.downloadVideo();
    }
  };

  downloadVideo = async () => {
    if (typeof this.props.url === "undefined") {
      return;
    }
    // if (!this.props.isPremiumUser && this.props.isUserConsentAvaialable) {
    //   // try {
    //   //   this.props.showAd();
    //   // } catch (err) {}
    // }
    Toast("Download Started....", "LONG");
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
              this.props.url === undefined ? "transparent" : "#333",
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
  const {
    adEventCallback,
    removeAllAdEventListener,
    isSanitizedInterstitialAdLoaded,
    loadAd,
    showAd,
    adHidden,
  } = AdsHook.useInterestitialAd();
  const adsConsent = React.useContext(Context.AdsConsentContext);
  React.useEffect(() => {
    // console.log("calling....");
    // let event;
    if (!props.isPremiumUser) {
      adEventCallback();
      loadAd();
    }

    return () => {
      removeAllAdEventListener();
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showInterAd = () => {
    showAd();
    loadAd();
  };

  return (
    <VideoDownloadButton
      {...props}
      isUserConsentAvaialable={adsConsent != null && adsConsent != 0}
      showAd={showInterAd}
      adHidden={adHidden}
      isSanitizedInterstitialAdLoaded={isSanitizedInterstitialAdLoaded}
    />
  );
};
