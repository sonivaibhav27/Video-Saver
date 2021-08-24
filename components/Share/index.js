import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import RNFetchBlob from "rn-fetch-blob";
import Sharefile from "../SocialMedia/Sharefile";

const { width } = Dimensions.get("window");

export const DownloadLocation = RNFetchBlob.fs.dirs.MovieDir + "/Video Saver/";

const ShareComponent = ({ uri, shareDone, onSharePressed }) => {
  const [load, setLoad] = React.useState(false);
  const shareFile = async () => {
    setLoad(true);
    if (shareDone) {
      onSharePressed();
    }
    await Sharefile(uri);
    setLoad(false);
    if (shareDone) {
      shareDone();
    }
  };
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri,
        }}
      />
      <TouchableOpacity
        onPress={shareFile}
        style={styles.afterDownloadImageContainer}
      >
        {load ? (
          <ActivityIndicator size="small" color={"#fff"} />
        ) : (
          <View style={{ flexDirection: "row" }}>
            <Icon color="#fff" size={20} name="sharealt" />
            <Text style={styles.shareText}>Share</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
  },
  afterDownloadImageContainer: {
    padding: 10,
    backgroundColor: "#000",
    width: width * 0.7,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  shareText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  image: {
    height: width * 0.6,
    width: width * 0.7,
    backgroundColor: "#eee",
  },
});
export default ShareComponent;
