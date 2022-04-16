import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

//custom imports
import { Icons, Download, withTimeout } from "../../utils";
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
  const [onBtnClicked, setOnBtnClicked] = React.useState(false);
  const {
    loadRewardAd,
    showRewardAd,
    adEventEmitter,
    removeAllAdEventListener,
    isRewardedAdReady,
  } = useRewardAdsHook();
  const rewardEarned = React.useRef();
  React.useEffect(() => {
    if (!isPremiumUser) {
      adEventEmitter(
        () => {
          rewardEarned.current = true;
        },
        () => {
          clearTimeout(timeout);
          setLoadingAd(false);
          setOnBtnClicked(false);
          downloadVideo();
          if (typeof hideAllDownloadButtons === "function") {
            hideAllDownloadButtons();
          }
          rewardEarned.current = false;
        },
        () => {
          clearTimeout(timeout);
          if (onBtnClicked) {
            showRewardAd();
            setOnBtnClicked(false);
          }
        },
        () => {
          clearTimeout(timeout);
          setLoadingAd(false);
          if (rewardEarned.current) {
            setLoadingAd(false);
            downloadVideo();
            if (typeof hideAllDownloadButtons === "function") {
              hideAllDownloadButtons();
            }
            Toast("Download Started", "LONG");
            rewardEarned.current = false;
          }
        }
      );
      loadRewardAd();
    }

    let timeout = withTimeout(() => {
      //remove ad event handler.
      setOnBtnClicked(false);
      if (!downloadingStarted) {
        downloadVideo();
      }
    }, 10 * 1000);

    return () => {
      removeAllAdEventListener();
      clearTimeout(timeout);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadVideo = () => {
    setDownloadingStarted(true);
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
      if (isRewardedAdReady()) {
        // loadRewardAd();
        showRewardAd();
      } else {
        setOnBtnClicked(true);
      }
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
