import React from "react";
import {
  View,
  UIManager,
  LayoutAnimation,
  Platform,
  StyleSheet,
} from "react-native";
import Clipboard from "@react-native-community/clipboard";

//custom imports;
import {
  PasteLinkInput,
  PreviewVideoButton,
  Toast,
  CustomActivityIndicator,
  ShareVideo,
  VideoDownloadButton,
  ActionButtons,
} from "../../common";
import { DownloadLocation, Context } from "../../config";
import { MultipleVideoDownloadModal } from "../Instagram/components";
import downloadPin from "../../../server/pinterest";
import { AdsHook } from "../../hooks";
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

    this._isMount = true;
  }

  componentDidMount() {
    this._checkifClipboardExists();
  }

  _checkifClipboardExists = async () => {
    if (this.props.route) {
      if (this.props.route.params) {
        if (this.props.route.params.link) {
          if (this._isMount && this.props.route.params.link !== "") {
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
          const get = await Clipboard.getString();
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
      file: "",
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
      file: "",
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
          string.indexOf("pinterest") !== -1
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

        <ActionButtons
          condition={
            !Object.keys(this.state.pinUrl).length &&
            !this.state.pinterestResult.url.length
          }
          onPasteClicked={this.onPasteClicked}
          onGetLinkPress={this.fetchPin}
          urlLink={this.state.pinterestLink}
          whenToShowLoadingIndicator={this.state.isDataArrive}
        />

        {this.state.file.length > 0 &&
          this.state.pinterestResult.url.length <= 0 && (
            <View style={styles.align_margin}>
              <ShareVideo
                shareDone={this.shareDone}
                onSharePressed={this.onSharePressed}
                uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
              />
            </View>
          )}
        <AdsHook.BannerAd
          show={
            this.state.pinterestResult.url.length === 0 &&
            Object.keys(this.state.pinUrl).length === 0
          }
        />

        {this.state.pinterestResult.isMultiple && (
          <MultipleVideoDownloadModal videos={this.state.pinterestResult.url} />
        )}
        {Object.keys(this.state.pinUrl).length > 0 &&
          this.state.file.length === 0 && (
            <>
              <View style={styles.dummy} />
              <View style={styles.iconContainer}>
                {this.state.pinUrl.url != null &&
                  this.state.file.length <= 0 && (
                    <PreviewVideoButton url={this.state.pinUrl.url} />
                  )}
                <VideoDownloadButton
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
            <CustomActivityIndicator text="loading..." />
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
  dummy: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
});

export default (props) => {
  const rollbar = React.useContext(Context.RollbarLoggerContext);
  return <PrivateVideo {...props} rollbarLogger={rollbar} />;
};
