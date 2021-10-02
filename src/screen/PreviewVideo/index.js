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

//custom imports;
import { Icons } from "../../utils";
import { Toast } from "../../common";

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
    Toast("error");
  };
  const onVideoPaused = () => {
    setVideoPaused((e) => !e);
  };

  const videoRef = React.useRef();
  return (
    <View style={styles.flex}>
      <View style={styles.container}>
        <View style={styles.volumeContainer}>
          <Icons.FontAwesome
            size={20}
            name="volume-off"
            onPress={() => setVolume(0.0)}
          />
          <Slider
            value={volume}
            style={styles.sliderWidth}
            maximumValue={1}
            minimumValue={0}
            step={0.1}
            thumbTintColor={"#000"}
            maximumTrackTintColor="#000"
            minimumTrackTintColor="#000"
            onValueChange={(value) => setVolume(value)}
          />
          <Icons.FontAwesome
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
          style={styles.videoStyle}
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
        />
        {videoBuffer && (
          <View style={styles.absoluteCenter}>
            <View style={styles.bufferLoadingContainer}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          </View>
        )}
        {videoData != null && (
          <View style={styles.controlContainer}>
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
            <View style={styles.videoInfoContainer}>
              <View>
                <Text style={styles.currentTimeText}>
                  {(currentTime / 60).toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={onVideoPaused}
                hitSlop={{
                  top: 10,
                  left: 10,
                  bottom: 10,
                  right: 10,
                }}
                style={styles.pausePlayButton}
              >
                <Icons.AntDesign
                  color="#000"
                  name={paused ? "caretright" : "pause"}
                  size={30}
                />
              </TouchableOpacity>
              <View style={styles.totalTimeContainer}>
                <Text style={styles.currentTimeText}>
                  {(videoData.duration / 60).toFixed(2)}
                </Text>
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
    justifyContent: "center",
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
  },
  videoStyle: {
    width: width,
    height: height * 0.4,
    maxWidth: 400,
    maxHeight: 400,
    alignSelf: "center",
  },
  absoluteCenter: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  bufferLoadingContainer: {
    padding: 10,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  controlContainer: {
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 10,
    maxWidth: 400,
    top: -50,
  },
  videoInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pausePlayButton: {
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  currentTimeText: {
    fontWeight: "400",
    color: "#333",
  },
  sliderWidth: { width: 200 },
  flex: { flex: 1 },
});
