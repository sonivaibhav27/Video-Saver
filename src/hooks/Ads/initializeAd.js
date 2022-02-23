import admob from "react-native-google-mobile-ads";

export default async () => {
  try {
    const adapter = await admob().initialize();
    console.log(adapter);
    // await admob().setRequestConfiguration({
    //   testDeviceIdentifiers: ['B3EEABB8EE11C2BE770B684D95219ECB', 'EMULATOR'],
    // });
  } catch (_) {}
};
