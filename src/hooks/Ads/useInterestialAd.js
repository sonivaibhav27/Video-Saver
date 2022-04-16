import React from "react";
import AppLovinMAX from "react-native-applovin-max";

const InterstitialID = "b10412926b896fee";

const eventSubscriptions = {
  adLoadedEventListener: null,
  adHiddenEventListener: null,
  adLoadFailedEventListener: null,
  adFailedToDisplayEventListener: null,
};

export default () => {
  const [adHidden, setAdHidden] = React.useState(false);
  const [isApplovinAdLoaded, setIsAppLovinAdLoaded] = React.useState(false);
  const adEventCallback = () => {
    console.log("Called");
    eventSubscriptions.adHiddenEventListener = AppLovinMAX.addEventListener(
      "OnInterstitialHiddenEvent",
      () => {
        setAdHidden(true);
      }
    );
    eventSubscriptions.adLoadFailedEventListener = AppLovinMAX.addEventListener(
      "OnInterstitialLoadFailedEvent",
      () => {
        setAdHidden(true);
      }
    );
    eventSubscriptions.adLoadedEventListener = AppLovinMAX.addEventListener(
      "OnInterstitialLoadedEvent",
      (network) => {
        // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTERSTITIAL_AD_UNIT_ID) will now return 'true'

        // Reset retry attempt
        console.log(network);
        if (network.networkName === "AppLovin") {
          setIsAppLovinAdLoaded(true);
        } else {
          setIsAppLovinAdLoaded(false);
        }
      }
    );

    eventSubscriptions.adFailedToDisplayEventListener = AppLovinMAX.addEventListener(
      "OnInterstitialAdFailedToDisplayEvent",
      () => {
        // Interstitial ad failed to display. We recommend loading the next ad
        setAdHidden(true);
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
  const loadAd = () => {
    // if (!isSanitizedInterstitialAdLoaded()) {
    AppLovinMAX.loadInterstitial(InterstitialID);
    // }
  };
  const showAd = () => {
    AppLovinMAX.showInterstitial(InterstitialID);
  };

  const isSanitizedInterstitialAdLoaded = () => {
    return AppLovinMAX.isInterstitialReady(InterstitialID);
  };

  return {
    loadAd,
    showAd,
    adEventCallback,
    isSanitizedInterstitialAdLoaded,
    adHidden,
    removeAllAdEventListener,
  };
};
