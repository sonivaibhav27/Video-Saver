import React from "react";
import { View, StyleSheet } from "react-native";
import ClipBoard from "@react-native-community/clipboard";

//custom imports;
import { Share } from "../../utils";
import {
  VideoDownloadButton,
  CustomActivityIndicator,
  Toast,
  PasteLinkInput,
  ShareVideo,
  PreviewVideoButton,
  WatchVideoToDownload,
  ActionButtons,
} from "../../common";
import { DownloadLocation, Context } from "../../config";
import downloadTwitter from "../../../server/twitter";

class Twitter extends React.Component {
  constructor() {
    super();
    this.state = {
      link: "",
      data: null,
      loading: false,
      file: "",
      sharePress: false,
    };
    this._isMounted = true;
  }

  //Making Request
  makeRequest = () => {
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
  };

  shareFile = () => Share(`file:///${DownloadLocation}/${this.state.file}.mp4`);

  componentDidMount = () => {
    this.getCLipboardData();
  };
  getCLipboardData = async () => {
    if (ClipBoard.hasString()) {
      const getString = await ClipBoard.getString();

      if (getString.startsWith("https://twitter.com")) {
        if (this._isMounted) {
          this.setState({ link: getString });
        }
        this.btnFetchRequest();
      }
    }
  };

  componentWillUnmount = () => {
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
    const hasLink = ClipBoard.hasString();
    if (!hasLink) {
      Toast("No  link found on clipboard.");
      return;
    }
    ClipBoard.getString()
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
          urlLink={link}
          whenToShowLoadingIndicator={loading}
        />
        {
          file.length > 0 ? (
            <View style={styles.marginTop}>
              <ShareVideo
                shareDone={this.shareDone}
                onSharePressed={this.onSharePressed}
                uri={`file:///${DownloadLocation}/${this.state.file}.mp4`}
              />
            </View>
          ) : null
          // (
          //   <View style={styles.marginTop}>
          //     <BannerAd unitId={BannerID} size={AD_SIZE.MEDIUM_RECTANGLE} />
          //   </View>
          // )
        }
        <View style={styles.marginTop} />
        <View style={styles.downloadContainer}>
          {data != null && data.url != null && file.length === 0 && (
            <PreviewVideoButton url={data.url} />
          )}
          {data != null && file.length === 0 && (
            <View style={styles.flexDirectionAndAlignCenter}>
              {Object.entries(data).map((entry) => {
                if (entry[1] != null) {
                  if (entry[0] === "hd" && entry[1] != null) {
                    return (
                      <WatchVideoToDownload.WrapperWatchAdButton>
                        <WatchVideoToDownload.AdButton url={entry[1]} />
                      </WatchVideoToDownload.WrapperWatchAdButton>
                    );
                  } else {
                    return (
                      <VideoDownloadButton
                        getFileForShare={(fileName) => {
                          this.setState({ file: fileName });
                        }}
                        url={data === null ? undefined : entry[1]}
                      />
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
  marginTop: { alignItems: "center", marginTop: 20 },

  flexDirectionAndAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default (props) => {
  const rollbar = React.useContext(Context.RollbarLoggerContext);
  const adsConsent = React.useContext(Context.AdsConsentContext);
  return <Twitter {...props} rollbarLogger={rollbar} adsConsent={adsConsent} />;
};
