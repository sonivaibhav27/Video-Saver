import AppLovinMAX from "react-native-applovin-max";

const eventSubscriptions = {
  adLoadedEventListener: null,
  adRewardAdEarned: null,
  adLoadFailedEventListener: null,
  adFailedToDisplayEventListener: null,
  adHiddentEventCallback: null,
};

const RewardedAdID = "c16bd5d04b23f209";
const RewardedAds = () => {
  const adEventEmitter = (
    onRewardEarnedCallback,
    onErrorCallback,
    onAdLoadedCallback,
    onAdHiddenCallback
  ) => {
    eventSubscriptions.adLoadFailedEventListener = AppLovinMAX.addEventListener(
      "OnRewardedAdLoadFailedEvent",
      () => {
        // Rewarded ad failed to load
        // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)
        onErrorCallback();
      }
    );
    eventSubscriptions.adFailedToDisplayEventListener = AppLovinMAX.addEventListener(
      "OnRewardedAdFailedToDisplayEvent",
      () => {
        // Rewarded ad failed to display. We recommend loading the next ad
        onErrorCallback();
      }
    );

    eventSubscriptions.adRewardAdEarned = AppLovinMAX.addEventListener(
      "OnRewardedAdReceivedRewardEvent",
      () => {
        // Rewarded ad was displayed and user should receive the reward
        onRewardEarnedCallback();
      }
    );
    eventSubscriptions.adLoadedEventListener = AppLovinMAX.addEventListener(
      "OnRewardedAdLoadedEvent",
      () => {
        console.log("Reward ad loaded");
        onAdLoadedCallback();
      }
    );
    eventSubscriptions.adHiddentEventCallback = AppLovinMAX.addEventListener(
      "OnRewardedAdHiddenEvent",
      () => {
        onAdHiddenCallback();
      }
    );
  };
  const removeAllAdEventListener = () => {
    const notNullEventSubscriptions = Object.keys(eventSubscriptions).filter(
      (event) => eventSubscriptions[event] !== null
    );
    notNullEventSubscriptions.forEach((activeListener) => {
      eventSubscriptions[activeListener].remove();
      eventSubscriptions[activeListener] = null;
    });
  };

  const loadRewardAd = () => {
    AppLovinMAX.loadRewardedAd(RewardedAdID);
  };
  const showRewardAd = () => {
    if (AppLovinMAX.isRewardedAdReady(RewardedAdID)) {
      AppLovinMAX.showRewardedAd(RewardedAdID);
    }
  };

  const isRewardedAdReady = () => {
    return AppLovinMAX.isRewardedAdReady(RewardedAdID);
    //   AppLovinMAX.showRewardedAd(RewardedAdID);
    // }
  };
  return {
    loadRewardAd,
    showRewardAd,
    removeAllAdEventListener,
    adEventEmitter,
    isRewardedAdReady,
  };
};

export default RewardedAds;
