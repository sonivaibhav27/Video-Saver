/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  UIManager,
  LayoutAnimation,
  Platform,
  ScrollView,
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";
const { height } = Dimensions.get("window");
const date = new Date();

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default function InstagramMulipleDownload({ videos }) {
  React.useEffect(() => {
    LayoutAnimation.easeInEaseOut();
  }, [videos]);
  function download(urls, isAll = false) {
    if (!isAll) {
      removeOnceDownload(urls);
    }
    const fileName =
      date.toDateString() + date.getMilliseconds() + date.getTime();
    !isAll
      ? RNFetchBlob.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path:
              RNFetchBlob.fs.dirs.MovieDir +
              "/Video Saver/" +
              `${fileName}.mp4`,
          },
        })
          .fetch("GET", urls, { "Cache-Control": "no-store" })
          .then((res) => {
            // the temp file path with file extension `png`
            ToastAndroid.showWithGravityAndOffset(
              `File Saved: ${res.path()}`,
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
              0,
              10
            );

            // res.flush(); //removing cached data.
          })
          .catch(() => {
            Alert.alert(
              "Error",
              "Something went wrong while downloading video"
            );
          })
      : urls.map((url) => {
          RNFetchBlob.config({
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              path:
                RNFetchBlob.fs.dirs.MovieDir + "/Vidown/" + `${fileName}.mp4`,
            },
          })
            .fetch("GET", url.video, { "Cache-Control": "no-store" })
            .then(async (res) => {
              // the temp file path with file extension `png`
              const getPath = await res.path();
              ToastAndroid.showWithGravityAndOffset(
                `File Saved: ${getPath}`,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                0,
                10
              );
              setText("All Downloaded");

              // res.flush(); //removing cached data.
            })
            .catch(() => {
              Alert.alert(
                "Error",
                "Something went wrong while downloading video"
              );
            });
        });
  }
  const [text, setText] = React.useState("Download All");
  const [video, setVideo] = React.useState(videos);
  function removeOnceDownload(videourl) {
    const newData = video.filter((vid) => vid.video !== videourl);
    setVideo(newData);
  }
  return (
    <View style={styles.container}>
      <View style={{ ...StyleSheet.absoluteFill }}>
        {video.length > 0 && (
          <View
            style={{
              height: height * 0.7,
              backgroundColor: "#efefef",
              ...StyleSheet.absoluteFill,
              bottom: 0,
              top: null,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
            }}
          >
            <View style={{}}>
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 20,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                Multiple Videos Found
              </Text>
              <Text
                style={{ fontSize: 14, color: "#000", textAlign: "center" }}
              >
                Tap on image to download
              </Text>
            </View>
            <ScrollView
              style={{
                marginTop: 20,
                marginBottom: 5,
              }}
              contentContainerStyle={{
                justifyContent: "space-evenly",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {video.map((vid, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      download(vid.video);
                    }}
                    style={{
                      height: 100,
                      width: 100,
                      backgroundColor: "#fff",
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                  >
                    <Image
                      source={{ uri: vid.poster_image }}
                      style={{ flex: 1, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View
              style={{
                marginHorizontal: 20,
              }}
            >
              <TouchableOpacity
                disabled={
                  text === "All Downloading..." || text === "All Downloaded"
                }
                onPress={() => {
                  setText("All Downloading...");
                  download(video, true);
                }}
                style={{
                  backgroundColor:
                    text === "All Downloading..."
                      ? "rgba(0,0,0,0.5)"
                      : text === "Download All"
                      ? "#000"
                      : "#4bb543",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 3,
                  paddingVertical: 20,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}
                >
                  {text} {text === "Download All" && video.length}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
