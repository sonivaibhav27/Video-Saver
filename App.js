import "react-native-gesture-handler";
import React from "react";
import { PermissionsAndroid, StatusBar } from "react-native";
import OneSignal from "react-native-onesignal";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import withCodePush from "./components/CodePush";
import { LoggerContext, PermissionChecking } from "./components/Context";
import SplashScreenJs from "./components/SplashScreen";

import {
  Instagram,
  Pinterest,
  Twitter_Facebook,
  Vimeo,
  Whatsapp,
  Start,
  SettingsSection,
} from "./components/SocialMedia";
import TestDownload from "./components/DownloadScreen";
import Toast from "./components/Toast";
import ShowPermissionScreen from "./components/PermissionScreen";
import PreviewVideo from "./components/PreviewVideo";
import HelpEntryPoint from "./components/Help";
import { clearCookie } from "./components/Cookie";
import AsyncStorage from "@react-native-community/async-storage";
const Stack = createStackNavigator();

import { Client } from "rollbar-react-native";
const rollbar = new Client("bc7677e227ef4846bcb1633b09b0180c");

const _id = "7a688fc2-1c44-4935-bcee-17f7bee60bee";
class App extends React.Component {
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

  clearCookieForFirstTime = () => {
    AsyncStorage.getItem("_clear_cookie").then(async (value) => {
      if (value === null) {
        await clearCookie("facebook");
        await clearCookie("instagram");
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
    // this.setState({ loading: false });
    // this.getLinkFromClipboard();
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
      return <SplashScreenJs />;
    } else if (!this.state.loading && this.state.showPermissionScreen) {
      return <ShowPermissionScreen onPress={this.onPress} />;
    } else {
      return (
        <PermissionChecking.Provider
          value={{
            permission: this.state.permission,
          }}
        >
          <StatusBar backgroundColor='#fff' barStyle='dark-content' />
          <LoggerContext.Provider value={rollbar}>
            <NavigationContainer
              ref={(navigationRef) => (this.navigationRef = navigationRef)}
            >
              <Stack.Navigator
                initialRouteName='Entry'
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
                  name='Entry'
                  component={Start}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name='Detail'
                  component={Twitter_Facebook}
                  options={({ route }) => ({
                    headerTitle: route.params.name,
                    headerTitleStyle: {
                      textTransform: "capitalize",
                    },
                  })}
                />
                <Stack.Screen
                  name='insta'
                  component={Instagram}
                  options={{
                    headerTitle: "Instagram",
                  }}
                />
                <Stack.Screen
                  name='pin'
                  component={Pinterest}
                  options={{
                    headerTitle: "Pinterest",
                  }}
                />
                <Stack.Screen
                  name='vimeo'
                  component={Vimeo}
                  options={{
                    headerTitle: "Vimeo",
                  }}
                />
                <Stack.Screen
                  name='whatsapp'
                  options={{
                    headerTitle: "Whatsapp",
                    headerTitleStyle: {
                      marginLeft: -10,
                    },
                  }}
                  component={Whatsapp}
                />

                <Stack.Screen
                  options={{
                    headerShown: null,
                  }}
                  name='Help'
                  component={HelpEntryPoint}
                />
                <Stack.Screen name='Settings' component={SettingsSection} />
                <Stack.Screen name='Downloads' component={TestDownload} />
                <Stack.Screen
                  name='Preview'
                  component={PreviewVideo}
                  options={{ title: "Watch " }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </LoggerContext.Provider>
        </PermissionChecking.Provider>
      );
    }
  }
}

export default withCodePush(App);
