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

const ButtonWithAd = ({ url }) => {
  const [loadingAd, setLoadingAd] = React.useState(false);
  const [downloadingStarted, setDownloadingStarted] = React.useState(false);
  const [
    loadAd,
    showAd,
    rewardAdEventHandler,
    rewardedModifiedForEEA,
    rewardedRef,
  ] = useRewardAdsHook();
  React.useEffect(() => {
    let eventHandler = rewardAdEventHandler(
      () => {
        showAd();
      },
      () => {
        //User Earned Reward.
        setLoadingAd(false);
        setDownloadingStarted(true);
        Download(
          url,
          () => {
            setDownloadingStarted(true);
          },
          () => {
            setDownloadingStarted(true);
          }
        );
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
    return () => {
      eventHandler && eventHandler();
    };
  }, [rewardAdEventHandler, showAd, url]);

  const onPress = () => {
    setLoadingAd(true);
    loadAd();
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.container}
    >
      {!loadingAd ? (
        <View style={styles.btnContainer}>
          {!downloadingStarted && (
            <Icons.AntDesign name="download" size={16} color="white" />
          )}
          <Text style={styles.textStyle}>
            {!downloadingStarted ? "Hd Video" : "downloading..."}
          </Text>
        </View>
      ) : (
        <ActivityIndicator size="small" color="#fff" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    // paddingHorizontal: 20,
    paddingVertical: 10,
    maxWidth: 350,
    flexDirection: "row",
    backgroundColor: "purple",
    flex: 1,
  },
  btnContainer: { flexDirection: "row", alignItems: "center" },
  textStyle: { color: "#fff", fontSize: 20, marginLeft: 10 },
});

export default ButtonWithAd;
