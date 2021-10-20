import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import { Transitioning, Transition } from "react-native-reanimated";
import Clipboard from "@react-native-community/clipboard";

//custom imports;
import downloadVimeo from "../../../server/vimeo";
import { PasteLinkInput, Toast, ShareVideo, ActionButtons } from "../../common";
import { Context, DownloadLocation } from "../../config";
import { DownloadModalForDifferentVideoResolutions } from "./components";
import { AdsHook } from "../../hooks";
class Vimeo extends React.Component {
  constructor() {
    super();
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this._isMount = true;
    this.state = {
      data: [],
      image: "",
      vimeoLink: "",
      isDataArrive: false,
      show: false,
      file: "",
    };
  }

  componentDidUpdate() {
    LayoutAnimation.easeInEaseOut();
  }

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
  hideModal = () => {
    this.ref?.animateNextTransition();
    this.setState({ show: false });
  };

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
      <Transition.In type="slide-bottom" />
      <Transition.Change interpolation="linear" />
      <Transition.Out type="slide-bottom" />
    </Transition.Sequence>
  );

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
          <ActionButtons
            condition={!this.state.data.length}
            onPasteClicked={this.onPasteClicked}
            onGetLinkPress={this.fetchVimeo}
            urlLink={this.state.vimeoLink}
            whenToShowLoadingIndicator={this.state.isDataArrive}
          />
          <Text style={styles.infoText}>
            We are currently supporting only public videos of vimeo platform.
          </Text>

          <AdsHook.BannerAd
            show={this.state.data.length === 0 && this.state.file.length === 0}
          />

          {this.state.file.length > 0 && (
            <View style={styles.align_margin}>
              <ShareVideo
                shareDone={this.shareDone}
                onSharePressed={this.onSharePressed}
                uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
              />
            </View>
          )}

          {this.state.data.length > 0 &&
            this.state.show &&
            this.state.file.length === 0 && (
              <DownloadModalForDifferentVideoResolutions
                adsConsentStatus={this.props.adsConsent}
                data={this.state.data}
                hideModal={this.hideModal}
                posterImage={this.state.image}
                isPremiumUser={this.props.isPremiumUser}
                getFileForShare={(file) => {
                  if (this._isMount) {
                    this.setState({ file });
                  }
                }}
              />
            )}
        </View>
      </Transitioning.View>
    );
  }
}

export default (props) => {
  const rollbar = React.useContext(Context.RollbarLoggerContext);
  const adsConsent = React.useContext(Context.AdsConsentContext);
  return <Vimeo {...props} adsConsent={adsConsent} rollbarLogger={rollbar} />;
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
  infoText: {
    color: "#999",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
  align_margin: { alignItems: "center", marginTop: 20 },
});
