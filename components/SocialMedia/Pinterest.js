import React from "react";
import {
  Text,
  View,
  UIManager,
  LayoutAnimation,
  Platform,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import ClipBoard from "@react-native-community/clipboard";
import InstagramMulipleDownload from "./InstagramMultipleDownload";
import DownloadIcon from "../Download/Download";
import { BannerAd, InterstitialAd } from "@react-native-firebase/admob";
import { AdEvent, AD_SIZE, BannerID, ID } from "../RemoveAds/InitializeAd";
import downloadPin from "../../server/pinterest";
import PasteLinkInput from "../PasteLinkInput";
import ShareComponent, { DownloadLocation } from "../Share";
import CustomIndicator from "../ActivityIndicator";
import Toast from "../Toast";
import PreviewButton from "../PreviewVideo/PreviewButton";
import Clipboard from "@react-native-community/clipboard";
import PasteButton from "../PasteButton";
import { LoggerContext } from "../Context";
const { width } = Dimensions.get("window");

class PrivateVideo extends React.Component {
  constructor() {
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.state = {
      pinterestLink: "",
      pinterestResult: {
        url: [],
        isMultiple: false,
      },
      isDataArrive: false,
      pinUrl: {},
      file: "",
    };
    this.interstitialRef = InterstitialAd.createForAdRequest(ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    this._isMount = true;

    this.interstitialRef.load();
    this.setupAds();
  }

  setupAds = () => {
    this.unsubrscibe = this.interstitialRef.onAdEvent((type) => {
      if (type === AdEvent.LOADED) {
        if (this.state.isDataArrive) {
          this.interstitialRef.show();
        }
      }
      if (type === AdEvent.ERROR) {
      }
    });
  };

  componentDidMount() {
    this._checkifClipboardExists();
  }

  _checkifClipboardExists = async () => {
    if (this.props.route) {
      if (this.props.route.params) {
        if (this.props.route.params.link) {
          if (this._isMount && this.props.route.params.link != "") {
            this.setState(
              { pinterestLink: this.props.route.params.link },
              () => {
                this.fetchPin();
              }
            );

            return;
          }
        }
      }
    }
    try {
      const hasString = await Clipboard.hasString();
      if (hasString) {
        try {
          const get = await ClipBoard.getString();
          if (get.startsWith("https://pin.it")) {
            if (this._isMount) {
              this.setState({ pinterestLink: get }, () => {
                this.fetchPin();
              });
            }
          }
        } catch (error) {}
      } else {
        Toast("Nothing to copy from clipboard");
      }
    } catch (_) {}
  };
  componentWillUnmount = () => {
    this._isMount = false;
    this.unsubrscibe();
  };

  componentDidUpdate = () => {
    LayoutAnimation.easeInEaseOut();
  };

  fetchPin = () => {
    this.setState({ isDataArrive: true });
    this._isMount &&
      downloadPin(this.state.pinterestLink)
        .then((response) => {
          if (response.isMultiple) {
            if (this._isMount) {
              this.setState({
                pinterestResult: {
                  ...response,
                },
                isDataArrive: false,
              });
            }
          } else {
            if (this._isMount) {
              this.setState({ pinUrl: response, isDataArrive: false });
            }
          }
        })
        .catch((err) => {
          if (this._isMount) {
            this.setState({
              loading: false,
              isDataArrive: false,
            });
          }

          Toast(err.err);
          if (!!err.message) {
            this.props.rollbarLogger.debug(
              "[Pinterest] " + this.state.pinterestLink + " " + err.message
            );
          }
        });
  };
  onChangeText = (e) => this.setState({ pinterestLink: e });
  onSharePressed = () => this.setState({ sharePress: true });

  shareDone = () => this.setState({ sharePress: false });
  onCrossClicked = () =>
    this.setState({
      pinterestLink: "",
      pinUrl: {},
      isDataArrive: false,
      pinterestResult: {
        url: [],
        isMultiple: false,
      },
    });
  onPasteClicked = () => {
    this.setState({
      pinterestLink: "",
      pinUrl: {},
      isDataArrive: false,
      pinterestResult: {
        url: [],
        isMultiple: false,
      },
    });
    const hasPinterestLink = Clipboard.hasString();
    if (!hasPinterestLink) {
      Toast("No insta link found on clipboard.");
      return;
    }

    Clipboard.getString()
      .then((string) => {
        if (
          string.startsWith("https://pin") ||
          string.startsWith("https://www.pinterest") ||
          string.indexOf("pinterest") != -1
        ) {
          this.setState({ pinterestLink: string });
        } else {
          Toast("No pinterest link found");
        }
      })
      .catch((_) => {
        Toast("Error while copying the link.");
      });
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <PasteLinkInput
            value={this.state.pinterestLink}
            onChangeText={this.onChangeText}
            onCrossClicked={this.onCrossClicked}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 20,
            marginTop: 10,
          }}
        >
          <PasteButton onPress={this.onPasteClicked} />
          {!Object.keys(this.state.pinUrl).length &&
          !this.state.pinterestResult.url.length ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              onPress={this.fetchPin}
              disabled={!this.state.pinterestLink.length}
            >
              <View
                style={[
                  styles.buttonTextContainer,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: this.state.pinterestLink
                      ? "#2d2e2f"
                      : "rgba(45, 46, 47,0.3)",
                  },
                ]}
              >
                {this.state.isDataArrive ? (
                  <ActivityIndicator size='small' color='#fff' />
                ) : (
                  <Text style={styles.getLinkText}>Get Link</Text>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              disabled={true}
            >
              <View
                style={[
                  styles.buttonTextContainer,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor: "#4bb543",
                    flexDirection: "row",
                    alignItems: "center",
                  },
                ]}
              >
                <Text style={styles.fetchText}>Fetched</Text>
                <Icon
                  name='checkcircle'
                  style={styles.marginLeft}
                  size={20}
                  color={"#fff"}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>

        {this.state.file.length > 0 &&
        this.state.pinterestResult.url.length <= 0 ? (
          <View style={styles.align_margin}>
            <ShareComponent
              shareDone={this.shareDone}
              onSharePressed={this.onSharePressed}
              uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
            />
          </View>
        ) : (
          <View style={styles.align_margin}>
            <BannerAd unitId={BannerID} size={AD_SIZE.MEDIUM_RECTANGLE} />
          </View>
        )}
        {this.state.pinterestResult.isMultiple ? (
          <InstagramMulipleDownload videos={this.state.pinterestResult.url} />
        ) : (
          <>
            <View style={styles.dummy} />
            <View style={styles.iconContainer}>
              {this.state.pinUrl.url != null && this.state.file.length <= 0 && (
                <PreviewButton url={this.state.pinUrl.url} />
              )}
              <DownloadIcon
                getFileForShare={(filName) => {
                  this.setState({ file: filName });
                }}
                url={this.state.pinUrl.url}
              />
            </View>
          </>
        )}
        {this.state.sharePress && (
          <View style={styles.positionAbsolute}>
            <CustomIndicator text='loading...' />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  textInputContainer: {
    marginHorizontal: 20,
    marginTop: 30,
  },

  buttonTextContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  positionAbsolute: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  iconContainer: {
    position: "absolute",
    bottom: 15,
    right: 20,
    left: 20,
    // flexDirection: "row",
    justifyContent: "space-between",
  },
  align_margin: { alignItems: "center", marginTop: 20 },
  fetchText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
  imageStyle: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: 10,
  },
  dummy: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  imageContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  getLinkText: { fontSize: 18, color: "#f1f1f1" },
  marginLeft: { marginLeft: 10 },
});

export default (props) => {
  const rollbar = React.useContext(LoggerContext);
  return <PrivateVideo {...props} rollbarLogger={rollbar} />;
};
