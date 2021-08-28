// CHECKED.

import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import HeaderTitle from "./HeaderTitle/index";
import {
  IconDisplay,
  ImageIcon,
  InstagramIcon,
} from "./SocialMedia/LogoIcons/index";
import Settings from "./Setting/Settings";

import {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
} from "@react-native-firebase/admob";
import useRewardAdsHook from "./RewardAds";
import RewardAlert from "./RewardAlert";
import ActivityIndicator from "./ActivityIndicator";

export default function App({ navigation }) {
  const [showRewardAlert, setShowRewardAlert] = React.useState(false);
  const contestRef = React.useRef();
  const [adLoaded, setAdLoaded] = React.useState(false);
  const [adConsentLoading, setAdconsentLoading] = React.useState(false);
  const [
    loadAd,
    showAd,
    rewardAdEventHandler,
    rewardedModifiedForEEA,
    rewardedRef,
  ] = useRewardAdsHook();
  const navigateToDownload = () => {
    navigation.navigate("Downloads");
  };
  const checkForAdsContest = async () => {
    // await AdsConsent.addTestDevices(["3F44BA187AF662C093736ABFE3CD1D46"]);
    await AdsConsent.addTestDevices(["05ADAA36163BF09902D81CCEC9FA322C"]);
    await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
    const consentInfo = await AdsConsent.requestInfoUpdate([
      "pub-2540765935808056",
    ]);
    console.log(consentInfo);

    contestRef.current = consentInfo;
  };

  React.useEffect(() => {
    checkForAdsContest();
    const event = rewardAdEventHandler(
      () => {
        setAdLoaded(true);
      },
      () => {
        setAdLoaded(false);
        setShowRewardAlert(false);
      }
    );
    return event;
  }, [rewardedRef]);
  const showRewardAlertCallback = async () => {
    if (!showRewardAlert) {
      if (contestRef?.current?.isRequestLocationInEeaOrUnknown) {
        try {
          const getUserStatus = await AdsConsent.getStatus();
          if (getUserStatus === AdsConsentStatus.UNKNOWN) {
            setAdconsentLoading(true);
            const formResult = await AdsConsent.showForm({
              privacyPolicy: "https://invertase.io/privacy-policy",
              withPersonalizedAds: true,
              withNonPersonalizedAds: true,
            });
            setAdconsentLoading(false);
            if (
              formResult.status == AdsConsentStatus.PERSONALIZED ||
              formResult.status === AdsConsentStatus.NON_PERSONALIZED
            ) {
              rewardedModifiedForEEA(formResult.status);
              loadAd();
            } else {
              return;
            }
          } else {
            rewardedModifiedForEEA(getUserStatus);
            loadAd();
          }
        } catch (err) {
          console.log(err);
          ToastAndroid.showWithGravityAndOffset(
            "Something went failed.",
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            20
          );
          return;
        }
      } else {
        loadAd();
      }
    }
    setShowRewardAlert(!showRewardAlert);
  };

  const showAdHelper = () => {
    try {
      showAd();
    } catch (err) {
      alert(err);
      ToastAndroid.showWithGravityAndOffset(
        "Can't load ad now.Please try again",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        0,
        20
      );
    }
  };

  return (
    <View style={styles.container}>
      <HeaderTitle {...{ showRewardAlertCallback }} />

      <View style={styles.flex}>
        <View style={styles.iconContainer}>
          <InstagramIcon navigation={navigation} text='Instagram' />
          <IconDisplay
            backgroundColor='#4267B2'
            onPress={() => {
              navigation.navigate("Detail", {
                platform: "fb",
                name: "Facebook",
              });
            }}
            isfb
            name='facebook-f'
            text='Facebook'
          />
          <IconDisplay
            backgroundColor='#1DA1F2'
            onPress={() => {
              navigation.navigate("Detail", {
                name: "twitter",
                platform: "twitter",
              });
            }}
            isTw
            name='twitter'
            text='Twitter'
          />
          <IconDisplay
            onPress={() => {
              navigation.navigate("whatsapp");
            }}
            isWp
            name='whatsapp'
            backgroundColor='#075e54'
            text='Whatsapp'
          />
          <ImageIcon
            onPress={() => {
              navigation.navigate("pin");
            }}
            backgroundColor='#fe3534'
            text='Pinterest'
          />
          <ImageIcon
            onPress={() => {
              navigation.navigate("vimeo");
            }}
            isVimeo
            backgroundColor='#00adef'
            text='Vimeo'
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Now Share Whatsapp Status without {"\n"} downloading it. 😊
          </Text>
        </View>

        <TouchableOpacity
          onPress={navigateToDownload}
          activeOpacity={0.9}
          style={styles.yourDownloads}
        >
          <Text style={styles.yourDownloadsText}>Downloads</Text>
        </TouchableOpacity>
        <Settings />
        {/* <Text style={{ textAlign: "center", fontWeight: "700", paddingTop: 5 }}>
          Version:Test Version 1.0
        </Text> */}
      </View>

      {showRewardAlert ? (
        <RewardAlert
          loading={adLoaded}
          showAdCallback={showAdHelper}
          close={showRewardAlertCallback}
        />
      ) : null}
      {adConsentLoading && (
        <ActivityIndicator text={`loading ad consent \nPlease wait...`} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flex: {
    flex: 1.2,
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  yourDownloads: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#262626",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  yourDownloadsText: {
    color: "#FFF",
    fontSize: 18,
  },
  infoContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  infoText: { textAlign: "center", fontWeight: "bold", color: "#000" },
});
