import React from "react";
import {
  AdEventType,
  AdsConsentStatus,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "@react-native-firebase/admob";
import { ToastAndroid } from "react-native";

// const AdsId = "ca-app-pub-2540765935808056~2490457734";
const AdsId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-2540765935808056/5383040921";

let rewarded = RewardedAd.createForAdRequest(AdsId, {
  requestNonPersonalizedAdsOnly: false,
});

const useRewardAdsHook = () => {
  const eventHandler = React.useCallback(
    (setLoadCallback, afterWatchCallback) => {
      const event = rewarded.onAdEvent((type, error) => {
        if (error) {
          console.log(error);
          ToastAndroid.showWithGravityAndOffset(
            "Can't load the ad now, please try again.",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            30
          );
          afterWatchCallback();
        }
        if (type === RewardedAdEventType.LOADED) {
          setLoadCallback(true);
        }
        if (type == AdEventType.CLICKED) {
          console.log("Clicked");
          alert("clicked");
        }

        if (type === RewardedAdEventType.EARNED_REWARD) {
          ToastAndroid.showWithGravityAndOffset(
            "Thank you so much for your help😇",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            0,
            30
          );
          afterWatchCallback();
        }
      });
      return event;
    },
    [rewarded]
  );

  const loadAd = () => {
    console.log(rewarded);
    rewarded.load();
  };

  const rewardedModifiedForEEA = (consentValue) => {
    rewarded = RewardedAd.createForAdRequest(AdsId, {
      requestNonPersonalizedAdsOnly:
        consentValue === AdsConsentStatus.NON_PERSONALIZED,
    });
  };

  const showAd = () => {
    rewarded.show();
  };

  //if we return as this , then it will be call on each render , so we will call this hook everytime and everytime , useEffect will be called, so return memoize callback

  //or scope issue
  //DIDN'T RUN
  //   return [loaded, rewarded.show];

  //return rewarded object instead or callback , IT RUN.
  return [loadAd, showAd, eventHandler, rewardedModifiedForEEA, rewarded];
};

export default useRewardAdsHook;
