import AppLovinMAX from "react-native-applovin-max";

export default () => {
  AppLovinMAX.initialize(
    "Fpa8dG7bbJ_4pw0ahdTrKOH7--Hodnn0iFxTfMFPOm0Qa6kl-atA2QnwTUoPl2RSnywb48izWEQcptDomL1r7T",
    (configuration) => {
      // SDK is initialized, start loading ads
      console.log("Initialize.");
      // AppLovinMAX.showMediationDebugger();
    }
  );
};
