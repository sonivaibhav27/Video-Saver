import {
  TestIds,
  InterstitialAd,
  AdEventType,
  BannerAdSize,
} from '@react-native-firebase/admob';

export const ID = __DEV__
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-2540765935808056/9020287933';

export const BannerID = __DEV__
  ? TestIds.BANNER
  : 'ca-app-pub-2540765935808056/1333369606';
export const interstitial = InterstitialAd.createForAdRequest(ID, {
  requestNonPersonalizedAdsOnly: true,
});

export const AdEvent = AdEventType;

export const AD_SIZE = BannerAdSize;
