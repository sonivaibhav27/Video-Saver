import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

//custom imports
import { Icons, Download } from "../../utils";
import useRewardAdsHook from "../../hooks/Ads/useRewardAd";

const ButtonWithAd = ({ url, showIconOnly = false, isPremiumUser = false }) => {
  const [loadingAd, setLoadingAd] = React.useState(false);
  const [downloadingStarted, setDownloadingStarted] = React.useState(false);
  const [loadAd, showAd, rewardAdEventHandler] = useRewardAdsHook();
  React.useEffect(() => {
    let eventHandler;
    if (isPremiumUser) {
      eventHandler = rewardAdEventHandler(
        () => {
          showAd();
        },
        () => {
          //User Earned Reward.
          setLoadingAd(false);
          setDownloadingStarted(true);
          downloadVideo();
        },
        () => {
          //closed Ad
          setLoadingAd(false);
        },
        () => {
          //error while loading ad.
          setLoadingAd(false);
        }
      );
    }

    return () => {
      if (
        typeof eventHandler !== "undefined" &&
        typeof eventHandler === "function"
      ) {
        eventHandler();
      }
    };
    //
  }, [rewardAdEventHandler, showAd, downloadVideo, isPremiumUser]);

  const downloadVideo = React.useCallback(() => {
    Download(
      url,
      () => {
        setDownloadingStarted(false);
      },
      () => {
        setDownloadingStarted(false);
      }
    );
  }, [url]);
  const onPress = () => {
    if (isPremiumUser) {
      downloadVideo();
    } else {
      setLoadingAd(true);
      loadAd();
    }
  };
  if (showIconOnly) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.showIconOnlyContainer}
      >
        {!loadingAd ? (
          <Icons.Entypo name="video" size={16} color="white" />
        ) : (
          <View style={styles.btnContainer}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      {!loadingAd ? (
        <View style={styles.btnContainer}>
          {!downloadingStarted && (
            <Icons.Entypo name="video" size={16} color="white" />
          )}
          <Text style={styles.textStyle}>
            {!downloadingStarted ? "Hd Video" : "downloading..."}
          </Text>
        </View>
      ) : (
        <View style={styles.btnContainer}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.loadingAdText}>Loading Ad...</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    maxWidth: 350,
    flexDirection: "row",
    backgroundColor: "#4e28a6",
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
  },
  btnContainer: { flexDirection: "row", alignItems: "center" },
  textStyle: { color: "#fff", fontSize: 20, marginLeft: 10 },
  loadingAdText: { color: "#fff", marginLeft: 4 },
  showIconOnlyContainer: {
    padding: 15,
    borderRadius: 100,
    backgroundColor: "#4e28a6",
  },
});

export default ButtonWithAd;
