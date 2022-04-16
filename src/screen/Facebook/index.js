import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ClipBoard from "@react-native-community/clipboard";
import AsyncStorage from "@react-native-community/async-storage";

//custom imports;
import { Icons, withTimeout } from "../../utils";
import {
  VideoDownloadButton,
  ShareVideo,
  CustomActivityIndicator,
  PasteLinkInput,
  Toast,
  PreviewVideoButton,
  ActionButtons,
  WatchVideoToDownload,
} from "../../common";
import { Share, Cookie } from "../../utils";
import { DownloadLocation, Context } from "../../config";
import downloadFb from "../../../server/fb";
import { FacebookWebsiteModal } from "./components";
import { AdsHook } from "../../hooks";
const { height } = Dimensions.get("window");
class Facebook extends React.Component {
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
    };

    this._isMounted = true;
  }

  //Making Request
  makeRequest = () => {
    if (this._isMounted) {
      downloadFb(this.state.link)
        .then((response) => {
          if (this._isMounted) {
            console.log({
              response,
            });
            this.setState({
              data: {
                sd: response.url !== -1 ? response.url : null,
                hd: response.hd !== -1 ? response.hd : null,
              },
              loading: false,
            });
          }
        })
        .catch((err) => {
          console.log(err.code);
          if (err.code === 400) {
            this.setState({ showFBLogin: true, loading: false });
          } else {
            if (!this.state.isFacebookLogin) {
              Toast("Please Login to your facebook to download video.");
              this.setState({ showFBLogin: true });
            } else {
              Toast(err.err);
            }
            this.setState({ loading: false });
          }
          if (!!err.message) {
            this.props.rollbarLogger.debug(
              "[Facebook] " + this.state.link + " " + err.message
            );
          }
        });
    }
  };

  shareFile = () => Share(`file:///${DownloadLocation}/${this.state.file}.mp4`);

  componentDidMount = () => {
    this._cookie();
    this.timeout = withTimeout(this.getCLipboardData);
    // AppState.addEventListener("change", this._handlerAppStateChange);
  };

  _cookie = async () => {
    try {
      const cookieInfo = await AsyncStorage.getItem("fb");
      console.log("[Cookie Info]", cookieInfo);
      if (cookieInfo != null) {
        this.setState({ isFacebookLogin: true });
        this.props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={this._clearFBCookie}
              style={styles.logoutButtonContainer}
              hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
            >
              <Icons.AntDesign name="logout" size={20} color="#333" />
              {/* eslint-disable-next-line react-native/no-inline-styles */}
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
  };

  _clearFBCookie = async () => {
    try {
      await AsyncStorage.removeItem("fb");
      Cookie.clearCookie("facebook")
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
        getString.startsWith("https://www.facebook.com") ||
        getString.startsWith("https://fb.watch")
      ) {
        if (this._isMounted) {
          this.setState({ link: getString });
          this.btnFetchRequest();
        }
      }
    }
  };

  componentWillUnmount = () => {
    clearTimeout(this.timeout);
    this._isMounted = false;
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
    const hasInstaLink = ClipBoard.hasString();
    if (!hasInstaLink) {
      Toast("No  link found on clipboard.");
      return;
    }
    ClipBoard.getString()
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
        <ActionButtons
          condition={data === null}
          onPasteClicked={this.onPasteClicked}
          onGetLinkPress={this.btnFetchRequest}
          whenToShowLoadingIndicator={loading}
          urlLink={link}
        />
        {file.length > 0 && (
          <View style={styles.marginTopAndAlignCenter}>
            <ShareVideo
              shareDone={this.shareDone}
              onSharePressed={this.onSharePressed}
              uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
            />
          </View>
        )}
        <AdsHook.ReactangularBannerAd show={file.length === 0} />

        <View style={styles.spacing} />
        <View style={styles.downloadContainer}>
          {data != null && data.sd != null && file.length === 0 && (
            <PreviewVideoButton url={data.sd} />
          )}

          <VideoDownloadButton
            getFileForShare={(fileName) => {
              this.setState({ file: fileName });
            }}
            url={data === null ? undefined : data.sd}
          />
          {data != null && file.length === 0 && (
            <View>
              {Object.entries(data).map((entry) => {
                if (entry[1] != null) {
                  if (entry[0] === "hd" && entry[1] != null) {
                    return (
                      <WatchVideoToDownload.WrapperWatchAdButton key={entry[0]}>
                        <WatchVideoToDownload.AdButton
                          adConsentStatus={this.props.adsConsent}
                          getFileForShare={(fileName) => {
                            this.setState({ file: fileName });
                          }}
                          isPremiumUser={this.props.isPremiumUser}
                          url={entry[1]}
                        />
                      </WatchVideoToDownload.WrapperWatchAdButton>
                    );
                  }
                }
              })}
            </View>
          )}
        </View>
        {this.state.sharePress && (
          <View style={styles.indicatorContainer}>
            <CustomActivityIndicator text="loading..." />
          </View>
        )}
        {this.state.showFBLogin && (
          <View style={styles.websiteModal}>
            <FacebookWebsiteModal
              onCrossModal={this.onCrossModal}
              isLoggedIn={this.state.isFacebookLogin}
              pastedUrl={this.state.link}
              afterLoginCallback={this._cookie}
            />
          </View>
        )}
        <AdsHook.BannerAd giveTopMargin={false} show={file.length === 0} />
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
  marginTopAndAlignCenter: { alignItems: "center", marginTop: 20 },
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
  spacing: {
    marginTop: 30,
  },
  logoutButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
});

export default (props) => {
  const rollbar = React.useContext(Context.RollbarLoggerContext);
  const adsConsent = React.useContext(Context.AdsConsentContext);

  return (
    <Facebook {...props} adsConsent={adsConsent} rollbarLogger={rollbar} />
  );
};
