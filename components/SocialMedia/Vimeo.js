import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import RNFetchBlob from "rn-fetch-blob";
import { Transitioning, Transition } from "react-native-reanimated";
import { BannerAd, InterstitialAd } from "@react-native-firebase/admob";
import Clipboard from "@react-native-community/clipboard";
import downloadVimeo from "../../server/vimeo";
import PasteLinkInput from "../PasteLinkInput";

const { height } = Dimensions.get("window");
import Toast from "../Toast";
import { AdEvent, AD_SIZE, BannerID, ID } from "../RemoveAds/InitializeAd";
import ShareComponent, { DownloadLocation } from "../Share";
import PreviewButton from "../PreviewVideo/PreviewButton";
import PasteButton from "../PasteButton";
import { LoggerContext } from "../Context";
class Vimeo extends React.Component {
  constructor() {
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.interstitialRef = InterstitialAd.createForAdRequest(ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    this._isMount = true;
    this.state = {
      data: [],
      image: "",
      vimeoLink: "",
      isDataArrive: false,
      show: false,
      file: "",
    };
    this.setupAds();
  }

  componentDidUpdate() {
    LayoutAnimation.easeInEaseOut();
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
    this.interstitialRef.load();
  };

  componentDidMount() {
    this.checkForClipboard();
  }

  async checkForClipboard() {
    try {
      const hasString = await Clipboard.hasString();
      if (hasString) {
        try {
          const get = await Clipboard.getString();
          if (get.startsWith("https://vimeo")) {
            if (this._isMount) {
              this.setState({ vimeoLink: get }, () => {
                this.fetchVimeo();
              });
            }
          }
        } catch (error) {}
      } else {
        Toast("Nothing to copy from clipboard");
      }
    } catch (_) {}
  }
  async downloadVimeoIntoDevice(url) {
    this.ref?.animateNextTransition();
    this.setState({ show: false });
    const date = new Date();
    const fileName =
      date.toDateString() + date.getMilliseconds() + date.getTime();
    try {
      const setupDownload = RNFetchBlob.config({
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path:
            RNFetchBlob.fs.dirs.MovieDir + "/Video Saver/" + `${fileName}.mp4`,
        },
      });
      const res = await setupDownload.fetch("GET", url);

      if (this._isMount) {
        this.setState({ file: fileName });
      }
      Toast(`File Saved: ${res.path()}`);
    } catch (_) {
      Toast("Something went wrong while downloading video");
    }
  }

  fetchVimeo = () => {
    this.setState({ isDataArrive: true, show: true }, () => {
      downloadVimeo(this.state.vimeoLink)
        .then(({ data, image }) => {
          this.setState({ data, image, isDataArrive: false });
        })
        .catch((err) => {
          this.setState({ isDataArrive: false });
          Toast(err.err);
          if (!!err.message) {
            this.props.rollbarLogger.debug(
              "[Vimeo] " + this.state.vimeoLink + " " + err.message
            );
          }
        });
    });
  };

  transition = (
    <Transition.Sequence>
      <Transition.In type='slide-bottom' />
      <Transition.Change interpolation='linear' />
      <Transition.Out type='slide-bottom' />
    </Transition.Sequence>
  );

  componentWillUnmount() {
    this.unsubrscibe && this.unsubrscibe();
  }

  onChangeText = (e) => this.setState({ vimeoLink: e });
  onCrossClicked = () =>
    this.setState({
      vimeoLink: "",
      data: [],
      image: "",
      isDataArrive: false,
      file: "",
    });
  onPasteClicked = () => {
    const hasVimeoLink = Clipboard.hasString();
    if (!hasVimeoLink) {
      Toast("No insta link found on clipboard.");
      return;
    }

    Clipboard.getString()
      .then((string) => {
        if (
          string.startsWith("https://www.vimeo") ||
          string.startsWith("https://vimeo")
        ) {
          this.setState({ vimeoLink: string });
        } else {
          Toast("No vimeo link found");
        }
      })
      .catch((_) => {
        Toast("Error while copying the link.");
      });
  };
  render() {
    return (
      <Transitioning.View
        transition={this.transition}
        ref={(ref) => (this.ref = ref)}
        style={styles.container}
      >
        <View style={styles.container}>
          <View style={styles.textInputContainer}>
            <PasteLinkInput
              value={this.state.vimeoLink}
              onChangeText={this.onChangeText}
              onCrossClicked={this.onCrossClicked}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 20,
              marginTop: 5,
            }}
          >
            <PasteButton onPress={this.onPasteClicked} />
            {!this.state.data.length ? (
              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={0.8}
                onPress={this.fetchVimeo}
                disabled={!this.state.vimeoLink.length}
              >
                <View
                  style={[
                    styles.buttonTextContainer,
                    {
                      backgroundColor: this.state.vimeoLink
                        ? "#2d2e2f"
                        : "rgba(45, 46, 47,0.3)",
                    },
                  ]}
                >
                  {this.state.isDataArrive ? (
                    <ActivityIndicator size='small' color='#fff' />
                  ) : (
                    <Text style={{ fontSize: 18, color: "#f1f1f1" }}>
                      Get Link
                    </Text>
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
                    {
                      backgroundColor: "#4bb543",
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                >
                  <Text
                    style={{ fontSize: 18, color: "#fff", fontWeight: "bold" }}
                  >
                    Fetched
                  </Text>
                  <Icon
                    name='checkcircle'
                    style={{ marginLeft: 10 }}
                    size={20}
                    color={"#fff"}
                  />
                </View>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.infoText}>
            We are currently supporting only public videos of vimeo platform.
          </Text>

          {this.state.data.length <= 0 && (
            <View style={styles.align_margin}>
              <BannerAd unitId={BannerID} size={AD_SIZE.MEDIUM_RECTANGLE} />
            </View>
          )}
          {this.state.file.length > 0 && (
            <View style={styles.align_margin}>
              <ShareComponent
                shareDone={this.shareDone}
                onSharePressed={this.onSharePressed}
                uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
              />
            </View>
          )}
          {this.state.data.length > 0 && this.state.show && (
            <View
              style={{
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
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  textAlign: "center",
                }}
              >
                Found Multiple Type
              </Text>
              <Text
                style={{ fontWeight: "600", fontSize: 14, textAlign: "center" }}
              >
                *more quality video takes more internet
              </Text>
              <ScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps='handled'
              >
                {this.state.data.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 10,
                        marginVertical: 4,
                        alignItems: "center",
                        borderBottomWidth: 1,
                        padding: 5,
                        borderBottomColor: "#eee",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={{ uri: this.state.image }}
                          style={{ height: 50, width: 50, borderRadius: 5 }}
                        />
                        <View style={{ marginLeft: 5 }}>
                          <Text style={{ fontWeight: "800", fontSize: 18 }}>
                            {item.q}
                          </Text>
                          <Text style={{ fontWeight: "600" }}>
                            {item.width} x {item.height}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{ alignItems: "center", flexDirection: "row" }}
                      >
                        <PreviewButton
                          style={{
                            padding: 10,
                            flex: 0,
                            marginBottom: 0,
                            marginRight: 10,
                            zIndex: 1000,
                          }}
                          url={item.url}
                          textFontSize={16}
                          showIcon={true}
                        />
                        <TouchableOpacity
                          hitSlop={{
                            bottom: 5,
                            top: 5,
                            left: 5,
                            right: 5,
                          }}
                          style={{
                            padding: 10,
                            backgroundColor: "#000",
                            borderRadius: 100,
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000,
                          }}
                          onPress={() => this.downloadVimeoIntoDevice(item.url)}
                        >
                          <Icon name='download' size={16} color='white' />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>
      </Transitioning.View>
    );
  }
}

export default (props) => {
  const rollbar = React.useContext(LoggerContext);
  return <Vimeo {...props} rollbarLogger={rollbar} />;
};

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
  infoText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  align_margin: { alignItems: "center", marginTop: 20 },
});
