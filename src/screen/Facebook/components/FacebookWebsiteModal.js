import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator as RNActivityIndicator,
  Easing,
} from "react-native";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-community/async-storage";

//custom imports;
import { Icons, Download } from "../../../utils";
import SaveVideoToFacebookModal from "./SaveVideoToFacebookModal";
import { CustomActivityIndicator } from "../../../common";

const FacebookWebsite = ({ onCrossModal, isLoggedIn, pastedUrl }) => {
  const webViewRef = React.useRef();
  const aR = React.useRef(new Animated.Value(0)).current;
  const [showDownloadError, setShowDownloadError] = React.useState(false);
  const [pageLoaded, setPageLoaded] = React.useState(false);
  const [isDownloadStarted, setDownloadedStarted] = React.useState(false);
  const url = isLoggedIn ? pastedUrl : "https://m.facebook.com/login";

  React.useEffect(() => {
    Animated.timing(aR, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [aR]);

  const getDownloadedLink = () => {
    setDownloadedStarted(true);
    fetch(pastedUrl, {})
      .then((data) => {
        // console.log(data);
        return data.text();
      })
      .then((html) => {
        // console.log(html);
        const startIndex = html.indexOf('<meta property="og:video:url"');
        //  sd_src_no_ratelimit,sd_Src,video:content
        if (startIndex === -1) {
          console.log({
            err: "This video is restricted as per facebook policy.",
            code: 400,
          });
        }
        const lastIndex = html.indexOf("/>", startIndex);

        const d = html.substring(startIndex + 39, lastIndex - 2);
        const _url = d.replace(/&amp;/g, "&").trim();
        console.log({ url });
        if (_url.startsWith("https://")) {
          Download(
            _url,
            () => {
              setDownloadedStarted(false);
            },
            () => {
              setDownloadedStarted(false);
            }
          );
        } else {
          setDownloadedStarted(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: aR.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
                extrapolate: "clamp",
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.subContainer}>
        {isLoggedIn && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDownloadError(true)}
            style={styles.unableContainer}
          >
            {/* eslint-disable-next-line react-native/no-raw-text */}
            <Text style={styles.unableText}>
              Unable to fetch the request, Go to download error issue.
              <Icons.Entypo name="chevron-right" size={20} />
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.wContainter}>
          {!isLoggedIn && (
            <Text style={styles.wText}>Login to download the video</Text>
          )}
          <TouchableOpacity
            onPress={onCrossModal}
            style={styles.crossContainer}
            hitSlop={{
              top: 5,
              left: 5,
              bottom: 5,
              right: 5,
            }}
          >
            <Icons.Entypo name="cross" size={20} />
          </TouchableOpacity>
        </View>
        <WebView
          ref={webViewRef}
          renderError={() => {
            return (
              <View style={styles.absoluteCenter}>
                <Text>Error while loading OFFICIAL Facebook website</Text>
              </View>
            );
          }}
          renderLoading={() => {
            return (
              <View style={styles.absoluteCenter}>
                <RNActivityIndicator size="small" color="#000" />
              </View>
            );
          }}
          onLoadEnd={(_) => {
            setPageLoaded(true);
          }}
          cacheEnabled={false}
          startInLoadingState
          source={{ uri: url }}
          style={styles.container}
          onNavigationStateChange={async (event) => {
            if (
              event.url === "https://m.facebook.com/?_rdr#_=_" ||
              event.url === "https://m.facebook.com/home.php?_rdr"
            ) {
              try {
                await AsyncStorage.setItem("fb", "true");
              } catch (err) {
                // Toast("error");
              }
            }
          }}
        />
      </View>
      {isLoggedIn && pageLoaded && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={getDownloadedLink}
          style={styles.downloadButtonContainer}
        >
          <Icons.AntDesign name="arrowdown" size={35} color="#fff" />
        </TouchableOpacity>
      )}
      {isDownloadStarted && (
        <View style={styles.indicatorContainer}>
          <CustomActivityIndicator text="downloading..." />
        </View>
      )}
      {showDownloadError && (
        <SaveVideoToFacebookModal closeModal={onCrossModal} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    flex: 1,
    zIndex: -20,
  },

  wContainter: {
    backgroundColor: "white",
    marginHorizontal: 10,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderColor: "#999",
  },
  crossContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 50,
  },
  wText: {
    fontSize: 18,
    fontWeight: "600",
  },
  unableContainer: {
    padding: 10,
    elevation: 3,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 2,
    zIndex: -1,
  },
  unableText: {
    fontSize: 16,
    fontWeight: "600",
  },

  downloadButtonContainer: {
    backgroundColor: "rgba(0, 171, 102, 1)",
    padding: 15,
    borderRadius: 100,
    alignSelf: "flex-end",
    right: 10,
    bottom: 10,
  },
  indicatorContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    zIndex: 10,
  },
  absoluteCenter: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FacebookWebsite;
