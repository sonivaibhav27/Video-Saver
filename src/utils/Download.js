import RNFetchBlob from "rn-fetch-blob";
import { Client } from "rollbar-react-native";

//custom imports;
import { Toast } from "../common";
import { DownloadLocation } from "../config";

const rollbar = new Client("bc7677e227ef4846bcb1633b09b0180c");
export default (url, successCallback, errorCallback) => {
  if (!url.toLowerCase().startsWith("https://")) {
    errorCallback();
    return;
  }
  const date = new Date();
  const fileName =
    date.toDateString() + date.getMilliseconds() + date.getTime();

  RNFetchBlob.config({
    addAndroidDownloads: {
      useDownloadManager: true,
      notification: true,
      path: DownloadLocation + `${fileName}.mp4`,
    },
  })
    .fetch("GET", url, { "Cache-Control": "no-store" })
    .then(async (res) => {
      console.log({
        res,
      });
      // the temp file path with file extension `png`
      Toast("Video Successfully Downloaded.");
      if (typeof successCallback === "function") {
        successCallback(fileName);
      }
    })
    .catch((err) => {
      rollbar.warning(`Download Error ${url} ${JSON.stringify(err)}`);
      console.log(err);
      if (typeof errorCallback === "function") {
        errorCallback();
      }
    });
};
