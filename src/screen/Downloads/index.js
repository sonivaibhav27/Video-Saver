import React, { Component } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  PermissionsAndroid,
  AppState,
  Alert,
  Linking,
} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import { Transition, Transitioning } from "react-native-reanimated";

//custom imports;
import { Icons } from "../../utils";
import { CustomActivityIndicator, Toast } from "../../common";
import { ShareModal } from "./components";
const { width } = Dimensions.get("window");

class DownloadsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      unfiltered: [],
      has_next_page: true,
      openShare: false,
      fileUrl: "",
      empty: null,
      loading: false,
      appState: AppState.currentState,
    };
    this._isMounted = true;
  }

  appStateHandler = (nextState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextState === "active"
    ) {
      this.checkPermission();
    }
  };
  checkPermission() {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
      .then((permission) => {
        if (permission) {
          if (this._isMounted) {
            this.setState({
              loading: false,
            });
            this.getAlbums();
          }
        } else {
          if (this._isMounted) {
            Alert.alert(
              "Permission",
              "Video Saver needs storage permission to get the album.",
              [
                {
                  text: "cancel",
                  style: "cancel",
                },
                {
                  text: "Go to settings",
                  onPress: () => Linking.openSettings(),
                },
              ]
            );
          }
        }
      })
      .catch(() => {
        Toast("Error, while requesting permission of storage.");
      });
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this.appStateHandler);
    this._isMounted = false;
  }
  getAlbums() {
    if (this.state.has_next_page) {
      CameraRoll.getPhotos({
        assetType: "All",
        first: 10,
        after: this.state.page.toString(),
        groupName: "Video Saver",
        include: ["filename", "fileSize"],
      })
        .then((data) => {
          if (data.edges.length <= 0) {
            if (this._isMounted) {
              this.setState({ empty: true });
            }
          } else {
            const allData = data.edges.map((node) => {
              return {
                uri: node.node.image.uri,
                type: node.node.type,
                fileName: node.node.image.filename,
                fileSize: node.node.image.fileSize,
              };
            });
            if (this._isMounted) {
              this.setState({
                page: data.page_info.end_cursor,
                has_next_page: data.page_info.has_next_page,
                unfiltered: [...this.state.unfiltered, ...allData],
              });
            }
          }
        })
        .catch(this.errCallback);
    }
  }

  errCallback = (err) => {
    if (
      err.message ===
      "Could not get media: need READ_EXTERNAL_STORAGE permission"
    ) {
      Toast("Error , Need Storage Permissions.");
    }
    Toast("Error");
  };

  componentDidMount = () => {
    this.checkPermission();
    AppState.addEventListener("change", this.appStateHandler);
    // this.getAlbums();
  };

  renderAlbum = ({ item }) => {
    return (
      <View style={styles.renderContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.imagestyles} />
        </View>
        <View style={styles.otherInfoContainer}>
          <View>
            <Text
              lineBreakMode="tail"
              textBreakStrategy="highQuality"
              style={{ width: width / 2 }}
              numberOfLines={1}
            >
              {item.fileName}
            </Text>
          </View>
          <View>
            <View style={styles.videoMarkContainer}>
              <Text style={styles.timeStamp}>
                {(item.fileSize * Math.pow(10, -6)).toFixed(2)} MB
              </Text>
            </View>

            <View style={styles.videoMarkContainer}>
              <Text style={styles.type}>Type: {item.type}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            // this.anim.animateNextTransition();
            this.setState({
              openShare: true,
              fileUrl: item.uri,
            });
          }}
          style={styles.threeDotContainer}
        >
          <Icons.Entypo size={20} name="dots-three-vertical" color={"#fff"} />
        </TouchableOpacity>
      </View>
    );
  };
  transition = (
    <Transition.Sequence>
      <Transition.In type="slide-bottom" />
      <Transition.Change interpolation="linear" />
      <Transition.Out type="slide-bottom" />
    </Transition.Sequence>
  );
  closeShare = () => {
    this.anim.animateNextTransition();
    this.setState({
      openShare: false,
    });
  };
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.emptyContainer}>
          <CustomActivityIndicator text="getting downloads" />
        </View>
      );
    }
    return (
      <Transitioning.View
        ref={(animation) => (this.anim = animation)}
        transition={this.transition}
        style={styles.flex}
      >
        {!this.state.empty && (
          <View style={styles.container}>
            {this.state.unfiltered.length > 0 ? (
              <FlatList
                onEndReached={(item) => {
                  this.getAlbums();
                }}
                onEndReachedThreshold={0.8}
                data={this.state.unfiltered}
                renderItem={this.renderAlbum}
                keyExtractor={(_, index) => index.toString()}
              />
            ) : (
              <View />
            )}
            {this.state.openShare && this.state.fileUrl.length > 0 && (
              <ShareModal
                closeModal={this.closeShare}
                url={this.state.fileUrl}
              />
            )}
          </View>
        )}
        {this.state.empty && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Empty Downloads,Downloads some videos and pictures to view your
              downloads.
            </Text>
          </View>
        )}
      </Transitioning.View>
    );
  }
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    backgroundColor: "#FFF",
    flex: 1,
    zIndex: -2000,
  },
  renderContainer: {
    width: width - 20,
    marginHorizontal: 10,

    marginBottom: 5,
    zIndex: -1,
    padding: 19,
    backgroundColor: "#fff",
    elevation: 4,
    borderRadius: 5,
    flexDirection: "row",
  },
  videoMarkContainer: {},
  threeDotContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",

    zIndex: 1000,
    bottom: 10,
    right: 10,
    height: 40,
    width: 40,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  imagestyles: { flex: 1, borderRadius: 10, backgroundColor: "#eee" },
  imageContainer: {
    height: width * 0.2,
    width: width * 0.2,
    elevation: 3,
  },
  timeStamp: {
    color: "#444",
    fontWeight: "bold",
    width: width / 2,
  },
  type: {
    color: "#888",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emptyText: {
    fontSize: 20,
    color: "#333",
    textAlign: "center",
  },
  otherInfoContainer: { marginLeft: 10, justifyContent: "space-between" },
});

export default DownloadsScreen;
