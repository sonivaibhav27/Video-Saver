import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

export default ({ route: { params } }) => {
  const [volume, setVolume] = React.useState(1.0);
  const [videoBuffer, setVideoBuffer] = React.useState(true);
  const [paused, setVideoPaused] = React.useState(false);
  const [videoData, setVideoData] = React.useState(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  if (params === null) {
    return;
  }

  const onVideoError = (err) => {
    console.log(err);
    alert("error");
  };
  const pauseVideo = () => {
    setVideoPaused((e) => !e);
  };

  const videoRef = React.useRef();
  const newUrl =
    "https://video.fbom12-1.fna.fbcdn.net/v/t42.1790-2/131363225_236192004607733_8694920120601376904_n.mp4?_nc_cat=110&ccb=1-3&_nc_sid=985c63&efg=eyJybHIiOjUzNiwicmxhIjoxMTA1LCJ2ZW5jb2RlX3RhZyI6InN2ZV9zZCJ9&_nc_ohc=LKevYjPp2C0AX-09xSY&rl=536&vabr=298&_nc_ht=video.fbom12-1.fna&oh=e89fe063eccae628a1c1e2f845a9ff63&oe=60D5AE0F";
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
            alignSelf: "center",
          }}
        >
          <FontAwesome
            size={20}
            name="volume-off"
            onPress={() => setVolume(0.0)}
          />
          <Slider
            value={volume}
            style={{ width: 200 }}
            maximumValue={1}
            minimumValue={0}
            step={0.1}
            thumbTintColor={"#000"}
            maximumTrackTintColor="#000"
            minimumTrackTintColor="#000"
            onValueChange={(value) => setVolume(value)}
          />
          <FontAwesome
            size={20}
            name="volume-up"
            onPress={() => setVolume(1.0)}
          />
        </View>
        <Video
          paused={paused}
          volume={volume}
          rate={1}
          resizeMode="contain"
          source={{
            uri: params.url,
          }}
          style={{
            width: width,
            height: height * 0.4,
            maxWidth: 400,
            maxHeight: 400,
            alignSelf: "center",
          }}
          progressUpdateInterval={500}
          onProgress={(data) => {
            setCurrentTime(data.currentTime);
          }}
          ref={videoRef}
          onError={onVideoError}
          onLoadStart={() => {
            setVideoBuffer(true);
          }}
          onBuffer={({ isBuffering }) => {
            setVideoBuffer(isBuffering ? true : false);
          }}
          // controls
          onLoad={(data) => {
            console.log("Data", data);
            setVideoData(data);
            setVideoBuffer(false);
          }}
          onEnd={() => {
            setVideoPaused(true);
          }}
        ></Video>
        {videoBuffer && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                padding: 10,
                borderRadius: 80,
                backgroundColor: "rgba(255,255,255,0.7)",
              }}
            >
              <ActivityIndicator size="small" color="#000" />
            </View>
          </View>
        )}
        {videoData != null && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.3)",
              padding: 10,
              maxWidth: 400,
              top: -50,
            }}
          >
            <Slider
              value={currentTime}
              minimumValue={0}
              maximumValue={videoData.duration}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="#fff"
              thumbTintColor="#EEE"
              onValueChange={(newValue) => {
                if (videoRef?.current) {
                  videoRef.current.seek(newValue);
                }
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  alignSelf: "flex-start",
                  padding: 5,
                  borderRadius: 3,
                }}
              >
                <Text>{(currentTime / 60).toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  setVideoPaused((e) => !e);
                }}
                hitSlop={{
                  top: 10,
                  left: 10,
                  bottom: 10,
                  right: 10,
                }}
                style={{
                  backgroundColor: "#fff",
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  color="#000"
                  style={{
                    fontWeight: "bold",
                  }}
                  name={paused ? "caretright" : "pause"}
                  size={30}
                />
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#fff",
                  alignSelf: "flex-start",
                  padding: 5,
                  borderRadius: 3,
                }}
              >
                <Text>{(videoData.duration / 60).toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  video: {
    backgroundColor: "#eee",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    // zIndex: -10,
  },
});
