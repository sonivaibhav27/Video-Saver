import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator as RNActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Easing } from "react-native-reanimated";
import WebView from "react-native-webview";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-community/async-storage";
import { LinkCopyHelper } from "./Help";
import ActivityIndicator from "./ActivityIndicator";
import DownloadHelper from "./Download.helper";
const DownlaodError = ({ closeModal }) => {
  const aValue = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(aValue, {
      duration: 600,
      useNativeDriver: true,
      toValue: 1,
    }).start();
  }, []);

  return (
    <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "#fff" }}>
      <TouchableOpacity
        onPress={closeModal}
        activeOpacity={0.9}
        style={styles.crossC}
      >
        <View style={styles.cross}>
          <Entypo name="cross" size={25} color="#fff" />
        </View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.downloadErrContainer,
          {
            opacity: aValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            transform: [
              {
                scale: aValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                  extrapolate: "clamp",
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Solve Download Error</Text>
        </View>
        <ScrollView style={{ flex: 1 }}>
          <LinkCopyHelper
            index={1}
            image={require("./Help/HelpImages/sav.jpeg")}
            label="Saved the video , you wish to download"
          />
          <LinkCopyHelper
            index={2}
            image={require("./Help/HelpImages/saved.jpeg")}
            label='press "saved" and copy link of video to download'
          />
          <LinkCopyHelper
            index={3}
            image={require("./Help/HelpImages/CopyLink.jpeg")}
            label="Copy the link of video "
          />
          <LinkCopyHelper
            index={4}
            image={require("./Help/HelpImages/paste.jpeg")}
            label='Paste on "Get Link"'
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
};

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
  }, []);

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
        if (startIndex == -1) {
          console.log({
            err:
              "This video is private, can't be downloaded without logged in.",
            code: 400,
          });
        }
        const lastIndex = html.indexOf("/>", startIndex);

        const d = html.substring(startIndex + 39, lastIndex - 2);
        const url = d.replace(/&amp;/g, "&").trim();
        console.log({ url });
        if (url.startsWith("https://")) {
          DownloadHelper(
            url,
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
            <Text style={styles.unableText}>
              Unable to fetch the request, Go to download error issue.
              <Entypo name="chevron-right" size={20} />
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
            <Entypo name="cross" size={20} />
          </TouchableOpacity>
        </View>
        <WebView
          ref={webViewRef}
          renderError={() => {
            return (
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>Error while loading OFFICIAL Facebook website</Text>
              </View>
            );
          }}
          renderLoading={() => {
            return (
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
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
          style={{ flex: 1 }}
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
          <AntDesign name="arrowdown" size={35} color="#fff" />
        </TouchableOpacity>
      )}
      {isDownloadStarted && (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator text="downloading..." />
        </View>
      )}
      {showDownloadError && <DownlaodError closeModal={onCrossModal} />}
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
  downloadErrContainer: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "#fff",
    // elevation: 2,
    marginTop: 20,
  },
  cross: {
    backgroundColor: "#4bb543",
    borderRadius: 30,
    padding: 6,
  },
  crossC: {
    zIndex: 30,
    // alignSelf: "flex-end",
    marginLeft: 10,
    position: "absolute",
    right: 10,
  },
  titleContainer: {
    padding: 10,
  },
  titleText: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
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
});

export default FacebookWebsite;
