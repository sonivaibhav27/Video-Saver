import "react-native-gesture-handler";
import React from "react";
import { PermissionsAndroid, StatusBar } from "react-native";
import OneSignal from "react-native-onesignal";
import { NavigationContainer } from "@react-navigation/native";
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
} from "../screen";
import { Toast } from "../common";
import { Cookie, Splash } from "../utils";
import { Context, CodePush } from "../config";
import { AdsHook } from "../hooks";

const Stack = createStackNavigator();

const rollbar = new Client("bc7677e227ef4846bcb1633b09b0180c");

const _id = "7a688fc2-1c44-4935-bcee-17f7bee60bee";
class Navigation extends React.Component {
  constructor(properties) {
    super(properties);
    OneSignal.setLogLevel(6, 0);
    OneSignal.init(_id);
    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.
    this.state = {
      permission: false,
      loading: true,
      showPermissionScreen: false,
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
  componentDidMount() {
    this.clearCookieForFirstTime();
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
                    component={HomeScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="facebook"
                    component={FacebookScreen}
                    options={{
                      headerTitle: "Facebook",
                    }}
                  />
                  <Stack.Screen
                    name="twitter"
                    component={TwitterScreen}
                    options={{
                      headerTitle: "Twitter",
                    }}
                  />
                  <Stack.Screen
                    name="instagram"
                    component={InstagramScreen}
                    options={{
                      headerTitle: "Instagram",
                    }}
                  />
                  <Stack.Screen
                    name="pinterest"
                    component={PinterestScreen}
                    options={{
                      headerTitle: "Pinterest",
                    }}
                  />
                  <Stack.Screen
                    name="vimeo"
                    component={VimeoScreen}
                    options={{
                      headerTitle: "Vimeo",
                    }}
                  />

                  <Stack.Screen
                    name="whatsapp"
                    options={{
                      headerTitle: "Whatsapp",
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
