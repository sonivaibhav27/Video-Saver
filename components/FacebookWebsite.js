import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Easing } from "react-native-reanimated";
import WebView from "react-native-webview";
import Entypo from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-community/async-storage";
import { LinkCopyHelper } from "./Help";
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

const FacebookWebsite = ({ onCrossModal, callback, isLoggedIn }) => {
  const aR = React.useRef(new Animated.Value(0)).current;
  const [showDownloadError, setShowDownloadError] = React.useState(false);
  React.useEffect(() => {
    Animated.timing(aR, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, []);
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
                <ActivityIndicator size="large" color="#000" />
              </View>
            );
          }}
          cacheEnabled={false}
          startInLoadingState
          renderToHardwareTextureAndroid
          source={{ uri: "https://m.facebook.com/login" }}
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

            // if (isTrue) {
            //   onCrossModal();
            //   callback();
            // }
          }}
        />
      </View>
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
});

export default FacebookWebsite;
