/**
 * @format
 */

import { AppRegistry } from "react-native";
import CheckDevice from "./CheckDevice";
import { name as appName } from "./app.json";
import Qonversion from "react-native-qonversion";
import { Keys } from "./src/config";

Qonversion.setDebugMode();
Qonversion.launchWithKey(Keys.KEY_Qonversion, false);

AppRegistry.registerComponent(appName, () => CheckDevice);
