import React from "react";
import {
  AdEventType,
  AdsConsentStatus,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "@react-native-firebase/admob";

//custom imports
import { Toast } from "../../common";
// const AdsId = "ca-app-pub-2540765935808056~2490457734";
const AdsId = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-2540765935808056/2949622732";

let rewarded = RewardedAd.createForAdRequest(AdsId, {
  requestNonPersonalizedAdsOnly: false,
});

const useRewardAdsHook = () => {
  const [userConsentStatus, setUserConsentStatus] = React.useState(null);
  const eventHandler = React.useCallback(
    (setLoadCallback, rewardEarnedCallback, closeAdCallback, errorCallback) => {
      const event = rewarded.onAdEvent((type, error) => {
        if (error) {
          console.log(error);
          Toast("Can't load the ad now, please try again.");
          if (typeof errorCallback === "function") {
            errorCallback();
          }
        }
        if (type === RewardedAdEventType.LOADED) {
          if (typeof setLoadCallback === "function") {
            setLoadCallback();
          }
        }
        if (type === AdEventType.CLICKED) {
          console.log("Clicked");
        }

        if (type === RewardedAdEventType.EARNED_REWARD) {
          if (typeof rewardEarnedCallback === "function") {
            rewardEarnedCallback();
          }
        }
        if (type === AdEventType.CLOSED) {
          if (typeof closeAdCallback === "function") {
            closeAdCallback();
          }
        }
      });
      return event;
    },
    []
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
  return [
    loadAd,
    showAd,
    eventHandler,
    rewardedModifiedForEEA,
    rewarded,
    {
      userConsentStatus,
      setUserConsentStatus,
    },
  ];
};

export default useRewardAdsHook;
