/* eslint-disable react-native/no-inline-styles */
import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  AppState,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import ClipBoard from "@react-native-community/clipboard";
import DownloadIcon from "./Download/Download";
import { BannerAd, InterstitialAd } from "@react-native-firebase/admob";
import { ID, AD_SIZE, BannerID, AdEvent } from "./RemoveAds/InitializeAd";
import Sharefile from "./SocialMedia/Sharefile";
import CustomIndicator from "./ActivityIndicator";
import downloadTwitter from "../server/twitter";
import downloadFb from "../server/fb";
import PasteLinkInput from "./PasteLinkInput";
import ShareComponent, { DownloadLocation } from "./Share";
import Toast from "./Toast";
import PreviewButton from "./PreviewVideo/PreviewButton";
import Clipboard from "@react-native-community/clipboard";
import PasteButton from "./PasteButton";
import FacebookWebsite from "./FacebookWebsite";
import { clearCookie } from "./Cookie";
import CodePush from "react-native-code-push";
import AsyncStorage from "@react-native-community/async-storage";
import { LoggerContext } from "./Context";
const { width, height } = Dimensions.get("window");
class Detail extends React.Component {
  constructor() {
    super();
    this.state = {
      link: "",
      data: null,
      loading: false,
      file: "",
      sharePress: false,
      showFBLogin: false,
      isFacebookLogin: null,
      appState: AppState.currentState,
    };
    this.interstitialRef = InterstitialAd.createForAdRequest(ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    this._isMounted = true;
    this.setupAds();
  }

  setupAds() {
    this.unsubrscibe = this.interstitialRef.onAdEvent((type) => {
      if (type === AdEvent.LOADED) {
        if (this.state.loading) {
          this.interstitialRef.show();
        }
      } else if (type === AdEvent.ERROR) {
      }
    });
    this.interstitialRef.load();
  }
  //Making Request
  makeRequest = () => {
    if (this._isMounted) {
      if (this.props.route.params.platform === "twitter") {
        if (this._isMounted) {
          downloadTwitter(this.state.link)
            .then((response) => {
              if (this._isMounted) {
                this.setState({ data: response, loading: false });
              }
            })
            .catch((err) => {
              Toast("Error" + err.err);
              this.setState({ loading: false });
              if (!!err.message) {
                this.props.rollbarLogger.debug(
                  "[Twitter] " + this.state.link + " " + err.message
                );
              }
            });
        }
      } else {
        downloadFb(this.state.link)
          .then((response) => {
            if (this._isMounted) {
              this.setState({
                data: response,
                loading: false,
              });
            }
          })
          .catch((err) => {
            if (err.code === 400) {
              this.setState({ showFBLogin: true, loading: false });
            } else {
              Toast(err.err);
              this.setState({ loading: false });
            }
            if (!!err.message) {
              this.props.rollbarLogger.debug(
                "[Facebook] " + this.state.link + " " + err.message
              );
            }
          });
      }
    }
  };

  shareFile = () =>
    Sharefile(`file:///${DownloadLocation}/${this.state.file}.mp4`);

  componentDidMount = () => {
    this._cookie();
    this.getCLipboardData();
    AppState.addEventListener("change", this._handlerAppStateChange);
  };
  _handlerAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      this.setState({ appState: nextAppState });
      if (
        this.state.link.length > 0 &&
        this.props.route.params.platform === "fb" &&
        this._isMounted &&
        this.state.file.length == 0
      ) {
        CodePush.restartApp();
      }
    }
  };

  _cookie = async () => {
    if (this.props.route.params.platform === "fb") {
      try {
        const cookieInfo = await AsyncStorage.getItem("fb");
        console.log("[Cookie Info]", cookieInfo);
        if (cookieInfo != null) {
          this.setState({ isFacebookLogin: true });
          this.props.navigation.setOptions({
            headerRight: () => (
              <TouchableOpacity
                onPress={this._clearFBCookie}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 5,
                }}
                hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
              >
                <Icon name="logout" size={20} color="#333" />
                <Text style={{ marginLeft: 2 }}>Logout</Text>
              </TouchableOpacity>
            ),
          });
        } else {
          this.props.navigation.setOptions({
            headerRight: () => null,
          });
        }
      } catch (error) {
        Toast(`Error getting status`);
      }
    }
  };

  _clearFBCookie = async () => {
    try {
      await AsyncStorage.removeItem("fb");
      clearCookie("facebook")
        .then(() => {
          Toast("Logout success", "LONG");
          this._cookie();
        })
        .catch((e) => {
          Toast(e.message);
        });
    } catch (err) {
      Toast("failed to logout");
    }
  };

  getCLipboardData = async () => {
    if (ClipBoard.hasString()) {
      const getString = await ClipBoard.getString();
      if (
        this.props.route.params.platform === "fb" &&
        (getString.startsWith("https://www.facebook.com") ||
          getString.startsWith("https://fb.watch"))
      ) {
        if (this._isMounted) {
          this.setState({ link: getString });
          this.btnFetchRequest();
        }
      } else if (
        this.props.route.params.platform === "twitter" &&
        getString.startsWith("https://twitter.com")
      ) {
        if (this._isMounted) {
          this.setState({ link: getString });
        }
        this.btnFetchRequest();
      }
    }
  };

  componentWillUnmount = () => {
    AppState.removeEventListener("change", this._handlerAppStateChange);
    this._isMounted = false;
    this.unsubrscibe && this.unsubrscibe();
  };

  btnFetchRequest = () => {
    this.setState({ loading: true });
    this.makeRequest();
  };
  onSharePressed = () => this.setState({ sharePress: true });

  shareDone = () => this.setState({ sharePress: false });

  onChangeText = (e) => this.setState({ link: e });
  onCrossClicked = () =>
    this.setState({
      link: "",
      file: "",
      data: null,
      loading: false,
      showFBLogin: null,
    });
  onPasteClicked = () => {
    this.setState({ link: "", file: "", data: null, loading: false });
    const hasInstaLink = Clipboard.hasString();
    if (!hasInstaLink) {
      Toast("No  link found on clipboard.");
      return;
    }

    if (this.props.route.params.platform === "fb") {
      Clipboard.getString()
        .then((string) => {
          const newString = string.trim();
          if (
            newString.startsWith("https://www.facebook.com/") ||
            newString.startsWith("https://fb.watch") ||
            newString.startsWith("https://fb.gg")
          ) {
            this.setState({ link: newString });
          } else {
            Toast("No facebook link found");
          }
        })
        .catch((_) => {
          Toast("Error while copying the link.");
        });
    } else {
      Clipboard.getString()
        .then((string) => {
          if (
            string.trim().startsWith("https://twitter.com/") ||
            string.trim().startsWith("https://www.twitter.com")
          ) {
            this.setState({ link: string.trim() });
          } else {
            Toast("No twitter link found");
          }
        })
        .catch((_) => {
          Toast("Error while copying the link.");
        });
    }
  };
  render() {
    const { data, loading, link, file } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <PasteLinkInput
            value={link}
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
          {data === null ? (
            <TouchableOpacity
              style={{ flex: 1 }}
              activeOpacity={0.8}
              disabled={!link}
              onPress={this.btnFetchRequest}
            >
              <View
                style={[
                  styles.buttonTextContainer,
                  {
                    backgroundColor: link ? "#2d2e2f" : "rgba(45, 46, 47,0.3)",
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
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
                  name="checkcircle"
                  style={{ marginLeft: 10 }}
                  size={20}
                  color={"#fff"}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {file.length > 0 ? (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <ShareComponent
              shareDone={this.shareDone}
              onSharePressed={this.onSharePressed}
              uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
            />
          </View>
        ) : (
          <View style={styles.marginTop}>
            <BannerAd unitId={BannerID} size={AD_SIZE.MEDIUM_RECTANGLE} />
          </View>
        )}
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 30,
          }}
        />
        <View style={styles.downloadContainer}>
          {this.state.data != null &&
            this.state.data.url != null &&
            file.length == 0 && <PreviewButton url={this.state.data.url} />}
          <DownloadIcon
            getFileForShare={(fileName) => {
              this.setState({ file: fileName });
            }}
            url={data === null ? undefined : data.url}
          />
        </View>
        {this.state.sharePress && (
          <View style={styles.indicatorContainer}>
            <CustomIndicator text="loading..." />
          </View>
        )}
        {/* this.props.route?.params?.platform === "fb" && this.state.showFBLogin && */}
        {this.props.route?.params?.platform === "fb" && this.state.showFBLogin && (
          <View style={styles.websiteModal}>
            <FacebookWebsite
              onCrossModal={this.onCrossModal}
              isLoggedIn={this.state.isFacebookLogin}
              pastedUrl={this.state.link}
            />
          </View>
        )}
      </View>
    );
  }
  onCrossModal = () => {
    this.setState({ showFBLogin: null });
  };
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
  afterDownloadImageContainer: {
    padding: 10,
    backgroundColor: "#000",
    width: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  shareText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  image: {
    height: width * 0.6,
    width: width * 0.7,
    backgroundColor: "#eee",
  },
  indicatorContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  downloadContainer: {
    position: "absolute",
    bottom: 15,
    right: 20,
    left: 20,
    justifyContent: "space-between",
  },
  marginTop: { alignItems: "center", marginTop: 20 },
  websiteModal: {
    height: height * 0.9 - 20,
    backgroundColor: "#FFF",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    elevation: 2,
    overflow: "hidden",
  },
});

export default (props) => {
  const rollbar = React.useContext(LoggerContext);
  return <Detail {...props} rollbarLogger={rollbar} />;
};
