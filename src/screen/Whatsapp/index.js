import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  FlatList,
  Text,
  Platform,
} from "react-native";
//custom imports
import { CustomActivityIndicator, Toast } from "../../common";
import {
  getUserWhatsapp,
  getMediaType,
  checkAndroid11PermissionIfNotThenAsked,
} from "./helper";
import { Whatsapp11HelperModal, WhatsappCard } from "./components";
import { Context } from "../../config";
import { AdsHook } from "../../hooks";
import AsyncStorage from "@react-native-community/async-storage";

const { height } = Dimensions.get("window");

export default function App(props) {
  const [status, setStatus] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [dir, setDir] = React.useState("");
  const [share, setSharePress] = React.useState(false);
  const [
    showWhatsapp11HelperModal,
    setShowWhatsapp11HelperModal,
  ] = React.useState(false);
  const { permission: Permission } = React.useContext(
    Context.StoragePermissionContext
  );
  const getStatues = () => {
    getUserWhatsapp()
      .then((data) => {
        const filteredStatus =
          data.status.length > 0 &&
          data.status.filter((item) => item !== ".nomedia");
        setStatus(filteredStatus);
        setLoading(false);
        setDir(data.dir);
      })
      .catch((err) => {
        Toast(err.err.message);
        setLoading(false);
      });
  };

  const checkForWhatsapp11InAsync = async () => {
    try {
      let uri = await AsyncStorage.getItem("whatsapp11uri");
      console.log(uri);
      if (uri) {
        getStatues();
      } else {
        setShowWhatsapp11HelperModal(true);
        setLoading(false);
      }
    } catch (err) {}
  };

  React.useEffect(() => {
    if (Platform.Version >= 30) {
      checkForWhatsapp11InAsync();
    }
  }, []);
  React.useEffect(() => {
    if (!Permission) {
      Alert.alert(
        "Error",
        "Give access to the system, to fetch whatsapp status",
        [
          {
            text: "Go to settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
    if (Permission) {
      if (Platform.Version < 30) {
        getStatues();
      }
    }
  }, [Permission]);

  const onOkPress = (i) => {
    setLoading(true);
    try {
      setShowWhatsapp11HelperModal(false);
      // return;
      checkAndroid11PermissionIfNotThenAsked(5)
        .then((p) => {
          if (p) {
            getStatues();
          }
        })
        .catch(() => {});
    } catch (err) {
      Toast("Retrying... For Permission");
    }
  };

  const onCancelPress = () => {
    props.navigation.pop();
  };

  const onSharePressed = () => setSharePress(true);

  const shareDone = () => setSharePress(false);

  const renderItem = (item) => {
    let type = getMediaType(item);
    if (type != null) {
      return (
        <WhatsappCard
          {...{ shareDone }}
          {...{ onSharePressed }}
          type={type}
          item={item}
          dir={dir}
        />
      );
    } else {
      return null;
    }
  };
  // if (loading) {
  //   return (
  //     <View style={styles.container}>
  //       <CustomActivityIndicator text="Loading..." />
  //     </View>
  //   );
  // }
  const getItemLayout = (data, index) => {
    return {
      length: height * 0.3,
      offset: height * 0.3 * index,
      index,
    };
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.container}>
          <CustomActivityIndicator text="Loading..." />
        </View>
      ) : showWhatsapp11HelperModal ? (
        <Whatsapp11HelperModal
          onOkPress={onOkPress}
          onCancelPress={onCancelPress}
        />
      ) : status.length !== 0 ? (
        <FlatList
          data={status}
          renderItem={({ item }) => renderItem(item)}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.flatlistContent}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
        />
      ) : (
        <View style={styles.middleItemAlign}>
          <Text style={styles.noStatusText}>No Status Found</Text>
        </View>
      )}
      {share && (
        <View style={styles.positionAbsolute}>
          <CustomActivityIndicator text="loading..." />
        </View>
      )}

      <AdsHook.BannerAd />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatlistContent: {
    alignItems: "center",
    marginTop: 10,
    paddingBottom: 10,
  },
  middleItemAlign: { flex: 1, justifyContent: "center", alignItems: "center" },
  noStatusText: { fontSize: 18, fontWeight: "bold" },
  positionAbsolute: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
});
