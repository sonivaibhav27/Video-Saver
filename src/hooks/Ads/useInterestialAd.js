import React from "react";
import {
  AdEventType,
  AdsConsentStatus,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";

const AdsId = "ca-app-pub-2540765935808056/6123971986";
export default () => {
  const interstitial = React.useRef(null);

  React.useEffect(() => {
    interstitial.current = InterstitialAd.createForAdRequest(AdsId, {
      requestNonPersonalizedAdsOnly: false,
    });
  }, []);

  const eventHandler = React.useCallback(
    (setLoadCallback, closeAdCallback, errorCallback) => {
      const event = interstitial.current.onAdEvent((type, error) => {
        if (error) {
          console.log(error);

          if (typeof errorCallback === "function") {
            errorCallback();
          }
        }
        if (type === AdEventType.LOADED) {
          if (typeof setLoadCallback === "function") {
            setLoadCallback();
          }
        }
        if (type === AdEventType.CLICKED) {
          console.log("Clicked");
        }
        if (type === AdEventType.CLOSED) {
          if (typeof closeAdCallback === "function") {
            closeAdCallback();
          }
        }
      });
      return event;
    },
    [interstitial]
  );
  const loadAd = () => {
    console.log(interstitial.current.loaded);
    try {
      if (!interstitial.current.loaded) {
        interstitial.current.load();
      }
    } catch (error) {}
  };

  const showAd = () => {
    try {
      interstitial.current.show();
    } catch (err) {
      console.log(err);
    }
  };

  const interestitialModifiedForEEA = (nonPersonalized) => {
    console.log({
      nonPersonalized,
    });
    interstitial.current = InterstitialAd.createForAdRequest(AdsId, {
      requestNonPersonalizedAdsOnly:
        nonPersonalized === AdsConsentStatus.NON_PERSONALIZED,
    });
  };

  return {
    loadAd,
    showAd,
    eventHandler,
    interestitialModifiedForEEA,
  };
};
