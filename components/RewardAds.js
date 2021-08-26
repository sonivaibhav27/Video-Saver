import React from "react";
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "@react-native-firebase/admob";
import { ToastAndroid } from "react-native";

const AdsId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-8999959423597689/9236787340";

const rewarded = RewardedAd.createForAdRequest(AdsId, {
  requestNonPersonalizedAdsOnly: true,
});

const useRewardAdsHook = () => {
  const eventHandler = (setLoadCallback, afterWatchCallback) => {
    const event = rewarded.onAdEvent((type, error, reward) => {
      if (error) {
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
  };

  const loadAd = () => {
    rewarded.load();
  };

  const showAd = () => {
    rewarded.show();
  };

  //if we return as this , then it will be call on each render , so we will call this hook everytime and everytime , useEffect will be called, so return memoize callback

  //or scope issue
  //DIDN'T RUN
  //   return [loaded, rewarded.show];

  //return rewarded object instead or callback , IT RUN.
  return [loadAd, showAd, eventHandler];
};

export default useRewardAdsHook;
