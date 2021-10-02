import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  Platform,
  ScrollView,
} from "react-native";
import RNFetchBlob from "rn-fetch-blob";

//custom imports;
import { Toast } from "../../../common";
const { height } = Dimensions.get("window");
const date = new Date();

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
export default function InstagramMulipleVideoDownloadModal({ videos }) {
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
            Toast(res.path());

            // res.flush(); //removing cached data.
          })
          .catch(() => {
            Toast("Error while downloading video.");
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
              Toast(res.path());
              setText("All Downloaded");

              // res.flush(); //removing cached data.
            })
            .catch(() => {
              Toast("Error while downloading video.");
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
          <View style={styles.videoListContainer}>
            <View>
              <Text style={styles.titleText}>Multiple Videos Found</Text>
              <Text style={styles.tapToDownloadText}>
                Tap on image to download
              </Text>
            </View>
            <ScrollView
              style={styles.wrapperContainer}
              contentContainerStyle={styles.posterListContainer}
            >
              {video.map((vid, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      download(vid.video);
                    }}
                    style={styles.posterContainer}
                  >
                    <Image
                      source={{ uri: vid.poster_image }}
                      style={styles.posterImage}
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.wrapperContainer}>
              <TouchableOpacity
                disabled={
                  text === "All Downloading..." || text === "All Downloaded"
                }
                onPress={() => {
                  setText("All Downloading...");
                  download(video, true);
                }}
                style={[
                  //eslint-disable-next-line react-native/no-inline-styles
                  {
                    backgroundColor:
                      text === "All Downloading..."
                        ? "rgba(0,0,0,0.5)"
                        : text === "Download All"
                        ? "#000"
                        : "#4bb543",
                  },
                  styles.downloadButtonContainer,
                ]}
              >
                <Text style={styles.downloadText}>
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
  videoListContainer: {
    height: height * 0.7,
    backgroundColor: "#efefef",
    ...StyleSheet.absoluteFill,
    bottom: 0,
    top: null,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  titleText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  posterListContainer: {
    justifyContent: "space-evenly",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  posterContainer: {
    height: 100,
    width: 100,
    backgroundColor: "#fff",
    marginTop: 10,
    borderRadius: 10,
  },
  tapToDownloadText: { fontSize: 14, color: "#000", textAlign: "center" },
  downloadText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  wrapperContainer: {
    marginTop: 20,
    marginBottom: 5,
  },
  posterImage: { flex: 1, borderRadius: 10 },
  downloadButtonContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    paddingVertical: 20,
  },
});
