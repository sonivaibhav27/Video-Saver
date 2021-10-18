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
import Toast from "../Toast";

const ButtonWithAd = ({
  url,
  showIconOnly = false,
  isPremiumUser = false,
  getFileForShare,
  hideAllDownloadButtons,
  adConsentStatus,
}) => {
  const [loadingAd, setLoadingAd] = React.useState(false);
  const [downloadingStarted, setDownloadingStarted] = React.useState(false);
  const [
    loadAd,
    showAd,
    rewardAdEventHandler,
    getRewardAdInstance,
  ] = useRewardAdsHook();
  const instance = React.useRef(getRewardAdInstance(adConsentStatus));
  console.log({ Ad: adConsentStatus });
  React.useEffect(() => {
    let eventHandler;
    if (!isPremiumUser) {
      eventHandler = rewardAdEventHandler(
        instance.current,
        () => {
          showAd(instance.current);
        },
        () => {
          //User Earned Reward.
          setLoadingAd(false);
          setDownloadingStarted(true);
          downloadVideo();
          if (typeof hideAllDownloadButtons === "function") {
            hideAllDownloadButtons();
          }
          Toast("Download Started", "LONG");
        },
        () => {
          //closed Ad
          setLoadingAd(false);
        },
        () => {
          //error while loading ad.
          setLoadingAd(false);
          setDownloadingStarted(true);
          downloadVideo();
          if (typeof hideAllDownloadButtons === "function") {
            hideAllDownloadButtons();
          }
          Toast("Download Started", "LONG");
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadVideo = () => {
    Download(
      url,
      (file) => {
        getFileForShare(file);
        if (!showIconOnly) {
          setDownloadingStarted(false);
        }
      },
      () => {
        if (!showIconOnly) {
          setDownloadingStarted(false);
        }
      }
    );
  };
  const onPress = () => {
    if (isPremiumUser) {
      downloadVideo();
    } else {
      setLoadingAd(true);
      loadAd(instance.current);
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
          <Icons.Entypo name="download" size={16} color="white" />
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
            <Icons.Entypo name="download" size={16} color="white" />
          )}
          <Text style={styles.textStyle}>
            {!downloadingStarted ? `Hd` : "downloading..."}
          </Text>
          {!downloadingStarted && (
            <Text style={styles.watchAdText}>(Watch Ad to Download)</Text>
          )}
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
  watchAdText: {
    fontSize: 13,
    color: "#fff",
    marginLeft: 5,
    fontWeight: "700",
  },
});

export default ButtonWithAd;
