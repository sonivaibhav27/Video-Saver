import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import WebView from "react-native-webview";
import PasteLinkInput from "../PasteLinkInput";
import CustomIndicator from "../ActivityIndicator";
import DownloadIcon from "../Download/Download";
import InstagramMulipleDownload from "./InstagramMultipleDownload";
import ShareComponent, { DownloadLocation } from "../Share";
import InstaWarningModal from "./WarningModal";
import { InterstitialAd } from "@react-native-firebase/admob";
import { AdEvent, ID } from "../RemoveAds/InitializeAd";
import Clipboard from "@react-native-community/clipboard";
import Toast from "../Toast";
import PreviewButton from "../PreviewVideo/PreviewButton";
import PasteButton from "../PasteButton";
import { clearCookie, getCookie } from "../Cookie";
import { LoggerContext } from "../Context";

// export const UserAgent = [
//   "Mozilla/5.0 (Linux; Android 9; SM-A102U Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.136 Mobile Safari/537.36 Instagram 155.0.0.37.107 Android (28/9; 320dpi; 720x1468; samsung; SM-A102U; a10e; exynos7885; en_US; 239490550)",
//   "Mozilla/5.0 (Linux; Android 10; SM-G973F Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/86.0.4240.198 Mobile Safari/537.36 Instagram 166.1.0.42.245 Android (29/10; 420dpi; 1080x2042; samsung; SM-G973F; beyond1; exynos9820; en_GB; 256099204)",
//   "Mozilla/5.0 (Linux; Android 9; SM-G955U Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/84.0.4147.111 Mobile Safari/537.36 Instagram 153.0.0.34.96 Android (28/9; 420dpi; 1080x2094; samsung; SM-G955U; dream2qltesq; qcom; en_US; 236572377)",
//   "Mozilla/5.0 (Linux; Android 9; SM-G960U Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/85.0.4183.81 Mobile Safari/537.36 Instagram 156.0.0.26.109 Android (28/9; 480dpi; 1080x2076; samsung; SM-G960U; starqltesq; qcom; en_US; 240726484)",
//   "Mozilla/5.0 (Linux; Android 10; SM-N975U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/84.0.4147.89 Mobile Safari/537.36 Instagram 135.0.0.28.119 Android (29/10; 480dpi; 1080x2051; samsung; SM-N975U; d2q; qcom; en_US; 206670927)",
//   "Mozilla/5.0 (Linux; Android 10; SM-G960U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/84.0.4147.125 Mobile Safari/537.36 Instagram 156.0.0.26.109 Android (29/10; 720dpi; 1440x2744; samsung; SM-G960U; starqltesq; qcom; en_US; 240726484)",
//   "Mozilla/5.0 (Linux; Android 8.1.0; motorola one Build/OPKS28.63-18-3; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.80 Mobile Safari/537.36 Instagram 72.0.0.21.98 Android (27/8.1.0; 320dpi; 720x1362; motorola; motorola one; deen_sprout; qcom; pt_BR; 132081645)",
//   "Mozilla/5.0 (Linux; Android 7.0; SM-G610M Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/67.0.3396.87 Mobile Safari/537.36 Instagram 51.0.0.20.85 Android (24/7.0; 480dpi; 1080x1920; samsung; SM-G610M; on7xelte; samsungexynos7870; pt_BR; 115211364)",
//   "Mozilla/5.0 (Linux; Android 9; SM-A102U Build/PPR1.180610.011; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.87 Mobile Safari/537.36 Instagram 137.0.0.34.123 Android (28/9; 320dpi; 720x1402; samsung; SM-A102U; a10e; exynos7885; en_US; 209143712)",
//   "Instagram 9.5.2 (iPhone7,2; iPhone OS 9_3_3; en_US; en-US; scale=2.00; 750x1334) AppleWebKit/420+",
// ];

const UserAgent = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Safari/537",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.67",
];

export function chooseUserAgent() {
  return UserAgent[Math.floor(Math.random() * UserAgent.length - 1)];
}
class Instagram extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoginButton: false,
      instaLink: "",
      showInstaWarning: false,
      showInstaLogin: false,
      instagramResult: {
        url: [],
        isMultiple: false,
      },
      isDataArrive: false,
      file: "",
      sharePress: false,
    };
    this.interstitialRef = InterstitialAd.createForAdRequest(ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    this._isMount = true;
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
    this.interstitialRef.load();
  };

  componentDidMount() {
    this.isItemAvailable();
    this._cookie();
  }
  onChangeText = (e) => this.setState({ instaLink: e });
  onSharePressed = () => this.setState({ sharePress: true });
  _cookie = async () => {
    try {
      const cookieInfo = await getCookie("instagram");
      if (
        cookieInfo != null &&
        cookieInfo.sessionid?.length > 0 &&
        cookieInfo.ds_user_id.length > 0
      ) {
        this.setState({ loading: false, showLoginButton: false });
        // console.log("COOKIE", isExist);
        this.props.navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={this._clearInstaCookie}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginRight: 5,
              }}
              hitSlop={{ top: 5, left: 5, right: 5, bottom: 5 }}
            >
              <AntDesign name='logout' size={20} color='#333' />
              <Text style={{ marginLeft: 2 }}>Logout</Text>
            </TouchableOpacity>
          ),
        });
      } else {
        this.setState({ loading: false, showLoginButton: true });
        this.props.navigation.setOptions({
          headerRight: () => null,
        });
      }
    } catch (error) {
      Toast(error.message);
    }
  };

  _clearInstaCookie = () => {
    clearCookie("instagram")
      .then(() => {
        Toast("Logout success", "LONG");
        this._cookie();
      })
      .catch((e) => {
        Toast(e.message);
      });
  };

  shareDone = () => this.setState({ sharePress: false });
  isItemAvailable = async () => {
    if (this.props.route) {
      if (this.props.route.params) {
        this.setState({ instaLink: this.props.route.params.link }, () => {
          this.fetchResult();
        });
      } else {
        const hasString = Clipboard.hasString();

        if (hasString) {
          Clipboard.getString().then((strings) => {
            console.log(strings);
            if (strings.startsWith("https://www.instagram.com")) {
              this.setState({ instaLink: strings }, () => {
                this.fetchResult();
              });
            }
          });
        }
      }
    }
  };

  componentWillUnmount() {
    this._isMount = false;
    this.unsubrscibe && this.unsubrscibe();
  }

  fetchResult = async () => {
    const userAgent =
      UserAgent[
        Math.round(Math.random() * UserAgent.length) % UserAgent.length
      ];
    console.log(this.state.instaLink);
    this.setState({
      isDataArrive: true,
    });
    if (this.state.instaLink.startsWith("https://www.instagram.com/")) {
      const parsedUrl =
        this.state.instaLink.indexOf("?") != -1
          ? this.state.instaLink + "&__a=1"
          : this.state.instaLink + "?__a=1";
      this._isMount &&
        fetch(parsedUrl, {
          headers: {
            "Cache-Control": "no-store,no-cache",
            "User-Agent": userAgent,
          },
          credentials: "omit",
        })
          .then((data) => {
            return data.json();
          })
          .then((response) => {
            if (Object.keys(response).length > 0) {
              let data = response.graphql.shortcode_media;
              if (data.is_video) {
                if (this._isMount) {
                  this.setState({
                    instagramResult: {
                      url: [data.video_url, data.display_url],
                      isMultiple: false,
                    },
                    isDataArrive: false,
                  });
                }
              } else {
                if (data.edge_sidecar_to_children) {
                  let urlOfVideos = [];
                  for (let video of data.edge_sidecar_to_children.edges) {
                    if (video.node.is_video) {
                      urlOfVideos.push({
                        video: video.node.video_url,
                        poster_image: video.node.display_url,
                      });
                    }
                  }
                  let sendToReact = {
                    url: urlOfVideos,
                    isMultiple: true,
                  };
                  if (this._isMount) {
                    this.setState({
                      instagramResult: {
                        ...sendToReact,
                      },
                      isDataArrive: false,
                    });
                  }
                } else {
                  Toast("No video found for this url.");
                  this.setState({ isDataArrive: false });
                }
              }
            } else if (Object.keys(response).length == 0) {
              if (this._isMount) {
                if (this.state.showLoginButton) {
                  Toast("Account is private, please login to download", "LONG");
                  this.setState({
                    isDataArrive: false,
                    showInstaWarning: true,
                  });
                } else {
                  Toast("You don't follow this person");
                  this.setState({
                    isDataArrive: false,
                  });
                }
              }
            } else {
              Toast("No video Url found.");
              if (this._isMount) {
                this.setState({
                  isDataArrive: false,
                });
              }
            }
          })
          .catch((err) => {
            if (err.message === "JSON Parse error: Unrecognized token '<'") {
              if (this._isMount) {
                if (!this.state.showLoginButton) {
                  Toast(
                    "You need to login to view this content as per the instagram official requirments."
                  );
                  this.setState({
                    showInstaWarning: true,
                  });
                } else {
                  Toast("You don't follow this person");
                }
              }
            } else if (err.message === "Network request failed") {
              Toast("Seems like you are not connected to internet.");
              return;
            } else {
              console.log(err);
              Toast("Something went wrong.");
            }
            this.setState({ isDataArrive: false });
            this.props.rollbarLogger.debug(
              "[Instagram] " + parsedUrl + err.message
            );
          });
    } else {
      Toast("This is not a valid Instagram Url");
      if (this._isMount) {
        this.setState({
          isDataArrive: false,
        });
      }
    }
  };

  onCrossClicked = () =>
    this.setState({
      instaLink: "",
      instagramResult: {
        url: [],
        isMultiple: false,
      },
      isDataArrive: false,
      file: "",
    });
  onPasteClicked = () => {
    this.setState({
      instaLink: "",
      instagramResult: {
        url: [],
        isMultiple: false,
      },
      isDataArrive: false,
      file: "",
    });
    const hasInstaLink = Clipboard.hasString();
    if (!hasInstaLink) {
      Toast("No insta link found on clipboard.");
      return;
    }

    Clipboard.getString()
      .then((string) => {
        if (string.startsWith("https://www.instagram.com/")) {
          this.setState({ instaLink: string });
        } else {
          Toast("No insta link found");
        }
      })
      .catch((_) => {
        Toast("Error while copying the link.");
      });
  };
  render() {
    return (
      <View style={styles.container}>
        {!this.state.showInstaLogin && (
          <React.Fragment>
            <View style={styles.textInputContainer}>
              <PasteLinkInput
                onChangeText={this.onChangeText}
                value={this.state.instaLink}
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
              <View style={{ flex: 1 }}>
                {!this.state.instagramResult.url.length ? (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={0.8}
                    onPress={this.fetchResult}
                    disabled={!this.state.instaLink.length}
                  >
                    <View
                      style={[
                        styles.buttonTextContainer,
                        {
                          backgroundColor: this.state.instaLink
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
                        style={{
                          fontSize: 18,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Fetched
                      </Text>
                      <AntDesign
                        name='checkcircle'
                        style={{ marginLeft: 10 }}
                        size={20}
                        color={"#fff"}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {!this.state.showInstaWarning &&
              !this.state.showInstaLogin &&
              this.state.showLoginButton &&
              !this.state.instagramResult.url.length && (
                <View style={{ marginTop: 20, marginHorizontal: 20 }}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "#555",
                      fontSize: 12,
                    }}
                  >
                    Want to download videos from Private account ?
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.setState({ showInstaWarning: true })}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.buttonTextContainer,
                        {
                          backgroundColor: "#eee",
                          marginTop: 3,
                          flexDirection: "row",
                          alignItems: "center",
                        },
                      ]}
                    >
                      <AntDesign name='instagram' size={30} color='#000' />
                      <Text
                        style={{
                          fontSize: 18,
                          color: "#000",
                          fontWeight: "600",
                          marginLeft: 5,
                        }}
                      >
                        Login with Insta
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
          </React.Fragment>
        )}

        {this.state.showInstaLogin && (
          <WebView
            cacheEnabled={false}
            source={{ uri: "https://www.instagram.com/accounts/login/" }}
            style={{
              ...StyleSheet.absoluteFill,
            }}
            onNavigationStateChange={async (event) => {
              console.log(event.url);
              if (
                event.url ===
                "https://www.instagram.com/accounts/onetap/?next=%2F"
              ) {
                this.setState({ showInstaLogin: false });
                await this.isItemAvailable();
                this._cookie();
              } else if (event.url === "https://www.instagram.com") {
                this.setState({ showInstaLogin: false });
                alert("error");
                clearCookie("instagram");
              } else if ("https://www.instagram.com/accounts/login/") {
              } else {
                this.setState({ showInstaLogin: false });
                clearCookie("instagram");
                alert("error");
              }
            }}
          />
        )}

        {this.state.instagramResult.isMultiple ? (
          <InstagramMulipleDownload videos={this.state.instagramResult.url} />
        ) : (
          <>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 30,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 15,
                right: 20,
                left: 20,
                // flexDirection: "row",
                justifyContent: "space-between",
                // alignItems: "center",
              }}
            >
              {this.state.instagramResult.url[0] != null &&
                this.state.file.length <= 0 && (
                  <PreviewButton url={this.state.instagramResult.url[0]} />
                )}
              <DownloadIcon
                getFileForShare={this.file}
                url={this.state.instagramResult.url[0]}
              />
            </View>
          </>
        )}
        {this.state.isDataArrive && (
          <CustomIndicator text={"Getting Data..."} />
        )}
        {this.state.file.length > 0 && !this.state.instagramResult.isMultiple && (
          <View
            style={{
              alignItems: "center",
              marginTop: 40,
              ...StyleSheet.absoluteFill,
              justifyContent: "center",
            }}
          >
            <ShareComponent
              shareDone={this.shareDone}
              onSharePressed={this.onSharePressed}
              uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
            />
          </View>
        )}
        {this.state.showInstaWarning && (
          <InstaWarningModal
            cancelLogin={this.cancelLogin}
            onPress={this.showInstagramLoginPage}
          />
        )}
        {this.state.sharePress && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            <CustomIndicator text='loading...' />
          </View>
        )}
      </View>
    );
  }
  file = (fileName) => this.setState({ file: fileName });
  cancelLogin = () => {
    this.setState({ showInstaWarning: false });
  };
  showInstagramLoginPage = () =>
    this.setState({ showInstaLogin: true, showInstaWarning: false });
}

export default function _Instagram(props) {
  const rollbar = React.useContext(LoggerContext);
  return <Instagram {...props} rollbarLogger={rollbar} />;
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
});
