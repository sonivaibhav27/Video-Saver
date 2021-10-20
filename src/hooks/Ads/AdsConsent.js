import React from "react";
import {
  AdsConsent,
  AdsConsentDebugGeography,
  AdsConsentStatus,
} from "@react-native-firebase/admob";
import { PRIVACY_POLICY } from "../../config";
export default () => {
  const [userConsentStatus, setUserConsentStatus] = React.useState(null);
  React.useEffect(() => {
    (async function () {
      if (__DEV__) {
        await AdsConsent.addTestDevices(["3F44BA187AF662C093736ABFE3CD1D46"]);
        // Production emulator
        await AdsConsent.addTestDevices(["0582F08BCC86D7B2E3B50E1B53A98478"]);
        await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
        await AdsConsent.addTestDevices(["05ADAA36163BF09902D81CCEC9FA322C"]);
        await AdsConsent.addTestDevices(["3EAEEE69510ACC7BE82166A9D097FC3D"]);
        await AdsConsent.setDebugGeography(AdsConsentDebugGeography.EEA);
      }
      await init();
    })();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userAdLocationAndStatus = async () => {
    const userAdInfo = await AdsConsent.requestInfoUpdate([
      "pub-2540765935808056",
    ]);
    return {
      isLocationInEEA: userAdInfo.isRequestLocationInEeaOrUnknown,
      status: userAdInfo.status,
    };
  };
  const getStatus = async () => {
    const getUserStatus = await AdsConsent.getStatus();
    return getUserStatus;
  };

  const init = async () => {
    try {
      if (
        userConsentStatus != null &&
        userConsentStatus !== AdsConsentStatus.UNKNOWN
      ) {
        setUserConsentStatus(userConsentStatus);
        return;
      }
      const userLocationAndStatus = await userAdLocationAndStatus();
      console.log({
        userLocationAndStatus,
      });
      if (userLocationAndStatus) {
        if (userLocationAndStatus.isLocationInEEA) {
          const status = await getStatus();
          console.log({ status });
          if (status === AdsConsentStatus.UNKNOWN) {
            const formResult = await showAdConsentForm();
            setUserConsentStatus(formResult.status);
          } else {
            setUserConsentStatus(status);
          }
        } else {
          setUserConsentStatus(AdsConsentStatus.PERSONALIZED);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showAdConsentForm = async () => {
    const formResult = await AdsConsent.showForm({
      privacyPolicy: PRIVACY_POLICY,
      withPersonalizedAds: true,
      withNonPersonalizedAds: true,
    });
    return formResult;
  };

  return userConsentStatus;
};
