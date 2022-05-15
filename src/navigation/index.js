import "react-native-gesture-handler";
import React from "react";
import { PermissionsAndroid, StatusBar } from "react-native";
import OneSignal from "react-native-onesignal";
import { NavigationContainer } from "@react-navigation/native";
import AppLovinMax from "react-native-applovin-max";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-community/async-storage";
import { Client } from "rollbar-react-native";
//custom imports;
import {
  OnBoardPermissionScreen,
  WhatsappScreen,
  InstagramScreen,
  DownloadsScreen,
  PreviewVideoScreen,
  HomeScreen,
  HelpScreen,
  SettingScreen,
  PinterestScreen,
  VimeoScreen,
  FacebookScreen,
  TwitterScreen,
  PricingModal,
} from "../screen";
import { Toast } from "../common";
import { Cookie, QonversionInApp, Splash } from "../utils";
import { Context, CodePush, Keys, Titles } from "../config";
import { AdsHook } from "../hooks";
import { UseAdConsent } from "../hooks/Ads";

const Stack = createStackNavigator();

const rollbar = new Client(Keys.Key_Rollbar, {
  captureUncaught: true,
  captureUnhandledRejections: true,
  appVersion: "6.4.16-release",
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        codeVersion: "6.4.16-release",
      },
    },
  },
});

class Navigation extends React.Component {
  constructor(properties) {
    super(properties);
    OneSignal.setLogLevel(6, 0);
    OneSignal.init(Keys.KEY_OneSignal);
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    this.state = {
      permission: false,
      loading: true,
      showPermissionScreen: false,
      userIsPremium: false,
      setStateForConsentForForceFullyReload: null,
    };
  }

  //initially clearing the cookie when first(When we first launch) we have not properly configure request
  clearCookieForFirstTime = () => {
    AsyncStorage.getItem("_clear_cookie").then(async (value) => {
      if (value === null) {
        await Cookie.clearCookie("facebook");
        await Cookie.clearCookie("instagram");
        await AsyncStorage.setItem("_clear_cookie", "true");
      }
    });
  };

  _setState = (obj) => {
    this.setState({ setStateForConsentForForceFullyReload: obj });
  };

  componentDidMount() {
    this.clearCookieForFirstTime();
    // this.checkIfUserIsPremium();
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    )
      .then((r) => {
        if (r) {
          this.setState({ permission: true, loading: false });
        } else {
          this.setState({
            showPermissionScreen: true,
            loading: false,
            permission: false,
          });
        }
      })
      .catch((_) => {
        Toast("Unable to fetch permissions.");
        this.setState({ loading: false });
      });
  }

  checkIfUserIsPremium = () => {
    QonversionInApp.checkIfUserPremium()
      .then((isPremium) => {
        this.setState({ userIsPremium: isPremium });
      })
      .catch((err) => {
        console.log(err);
        this.checkInAsyncStorageForPremium();
      });
  };
  checkInAsyncStorageForPremium = () => {
    AsyncStorage.getItem("premium")
      .then((data) => {
        if (data) {
          this.setState({ userIsPremium: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  onPress = () => {
    this.setState({
      permission: true,
      showPermissionScreen: false,
      loading: false,
    });
  };

  render() {
    if (this.state.loading) {
      return <Splash />;
    } else if (!this.state.loading && this.state.showPermissionScreen) {
      return <OnBoardPermissionScreen onPress={this.onPress} />;
    } else if (
      AppLovinMax.getConsentDialogState() ===
        AppLovinMax.ConsentDialogState.APPLIES &&
      !AppLovinMax.hasUserConsent()
    ) {
      return <UseAdConsent setState={this._setState} />;
    } else {
      return (
        <AdsHook.AdsProvider>
          <Context.StoragePermissionContext.Provider
            value={{
              permission: this.state.permission,
            }}
          >
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />
            <Context.RollbarLoggerContext.Provider value={rollbar}>
              <NavigationContainer
                ref={(navigationRef) => (this.navigationRef = navigationRef)}
              >
                <Stack.Navigator
                  initialRouteName="Entry"
                  screenOptions={{
                    animationEnabled: false,
                    headerStyle: {
                      elevation: 0,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    },
                  }}
                >
                  <Stack.Screen
                    name="Entry"
                    options={{
                      headerShown: false,
                    }}
                  >
                    {(initialsProps) => (
                      <HomeScreen
                        {...initialsProps}
                        isPremiumUser={this.state.userIsPremium}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="facebook"
                    options={{
                      headerTitle: Titles.Facebook,
                    }}
                  >
                    {(initialsProps) => (
                      <FacebookScreen
                        {...initialsProps}
                        isPremiumUser={this.state.userIsPremium}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="twitter"
                    options={{
                      headerTitle: Titles.Twitter,
                    }}
                  >
                    {(initialsProps) => (
                      <TwitterScreen
                        {...initialsProps}
                        isPremiumUser={this.state.userIsPremium}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="instagram"
                    options={{
                      headerTitle: Titles.Instagram,
                    }}
                  >
                    {(initialsProps) => (
                      <InstagramScreen
                        {...initialsProps}
                        isPremiumUser={this.state.userIsPremium}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="pinterest"
                    options={{
                      headerTitle: Titles.Pinterest,
                    }}
                  >
                    {(initialsProps) => (
                      <PinterestScreen
                        {...initialsProps}
                        isPremiumUser={this.state.userIsPremium}
                      />
                    )}
                  </Stack.Screen>
                  <Stack.Screen
                    name="vimeo"
                    options={{
                      headerTitle: Titles.Vimeo,
                    }}
                  >
                    {(initialsProps) => (
                      <VimeoScreen
                        {...initialsProps}
                        isPremiumUser={this.state.userIsPremium}
                      />
                    )}
                  </Stack.Screen>

                  <Stack.Screen
                    name="whatsapp"
                    options={{
                      headerTitle: Titles.Whatsapp,
                      headerTitleStyle: {
                        marginLeft: -10,
                      },
                    }}
                    component={WhatsappScreen}
                  />
                  <Stack.Screen
                    options={{
                      headerShown: null,
                    }}
                    name="help"
                    component={HelpScreen}
                  />
                  <Stack.Screen name="settings" component={SettingScreen} />
                  <Stack.Screen name="downloads" component={DownloadsScreen} />
                  <Stack.Screen
                    name="preview"
                    component={PreviewVideoScreen}
                    options={{ title: "Watch " }}
                  />
                  <Stack.Screen
                    name="pricingModal"
                    component={PricingModal}
                    options={{ headerShown: false }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </Context.RollbarLoggerContext.Provider>
          </Context.StoragePermissionContext.Provider>
        </AdsHook.AdsProvider>
      );
    }
  }
}

export default CodePush(Navigation);
