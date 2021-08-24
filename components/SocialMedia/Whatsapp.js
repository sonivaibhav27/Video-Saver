import * as React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
  FlatList,
  Text,
} from "react-native";

import ActivityIndicator from "../ActivityIndicator";
import { getUserWhatsapp } from "../Whatsapp/Helper/helper";
import { getMediaType } from "../Whatsapp/Constants";
import { PermissionChecking } from "../Context";
import WhatsappSection from "./WhatsappSection";
import Toast from "../Toast";
import { BannerAd } from "@react-native-firebase/admob";
import { AD_SIZE, BannerID } from "../RemoveAds/InitializeAd";
const { height } = Dimensions.get("window");

export default function App({}) {
  const [status, setStatus] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [dir, setDir] = React.useState("");
  const [share, setSharePress] = React.useState(false);
  const { permission: Permission } = React.useContext(PermissionChecking);
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
      getStatues();
    }
  }, [Permission]);

  const onSharePressed = () => setSharePress(true);

  const shareDone = () => setSharePress(false);

  const renderItem = (item) => {
    let type = getMediaType(item);
    if (type != null) {
      return (
        <WhatsappSection
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
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator text='Loading...' />
      </View>
    );
  }
  const getItemLayout = (data, index) => {
    return {
      length: height * 0.3,
      offset: height * 0.3 * index,
      index,
    };
  };

  return (
    <View style={styles.container}>
      {status.length != 0 ? (
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
          <ActivityIndicator text='loading...' />
        </View>
      )}
      <BannerAd
        key='Banner Ad'
        onAdFailedToLoad={() => {}}
        size={AD_SIZE.SMART_BANNER}
        unitId={BannerID}
      />
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
