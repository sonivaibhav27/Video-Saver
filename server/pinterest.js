import cheerio from "cheerio";
import { ToastAndroid } from "react-native";

const header = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
  redirect: "follow",
  crediantials: "omit",
};
export default (url) => {
  return new Promise((resolve, reject) => {
    async function getResult(retryTimeout, timeout) {
      try {
        let firstFetch = await fetch(url, header);
        const extractRedirectedUrl = firstFetch.url;
        if (url.indexOf("pinterest") === -1) {
          firstFetch = await fetch(
            extractRedirectedUrl.substring(
              0,
              extractRedirectedUrl.indexOf("/sent")
            ),
            header
          );
        }
        clearTimeout(retryTimeout);
        clearTimeout(timeout);

        const getHtmlText = await firstFetch.text();
        const $ = cheerio.load(getHtmlText);
        const getScript = $("script[id='initial-state']").get()[0].children[0]
          .data;
        const contentToJson = JSON.parse(getScript);
        console.log({ contentToJson });
        const responseFromStoryPins = contentToJson.storyPins;
        const responseFromPins = contentToJson.pins;
        const getStoryPinId = Object.keys(responseFromStoryPins);
        if (getStoryPinId.length) {
          console.log({ response: responseFromStoryPins[getStoryPinId[0]] });
          const pages = responseFromStoryPins[getStoryPinId[0]].pages;
          console.log({ pages });
          const urls = [];
          pages.forEach((page) => {
            const endpoint = page.blocks[0].video.video_list.V_EXP7;
            urls.push({
              video: endpoint.url,
              poster_image: endpoint.thumbnail,
            });
          });
          console.log({ urls });
          if (urls.length == 1) {
            resolve({
              url: urls[0],
              isMultiple: false,
            });
          } else {
            resolve({
              url: urls,
              isMultiple: true,
            });
          }
        }

        const keysOfResponseFromPins = Object.keys(responseFromPins);
        if (keysOfResponseFromPins.length) {
          const videos_ = responseFromPins[keysOfResponseFromPins[0]].videos;
          if (videos_) {
            Object.values(videos_.video_list).forEach((item) => {
              if (item.url && item.url.indexOf(".mp4")) {
                resolve({ url: item.url, isMultiple: false });
              }
            });
          } else {
            reject({ err: "No video found." });
          }
        }
      } catch (err) {
        console.log(err);
        clearTimeout(retryTimeout);
        clearTimeout(timeout);
        if (err.message == "Network request failed") {
          reject({
            err: "Seems like you are not connected to internet.",
            code: 400,
          });
        } else {
          reject({
            err: "Something went wrong with request.",
            message: err.message,
          });
        }
      }
    }

    if (url.startsWith("https://pin.it/") || url.indexOf("pinterest") != -1) {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        reject({
          err:
            "Can't able to fetch results, Please check your internet connection.",
        });
      }, 40000);

      getResult(retry, timeout);
      const retry = setTimeout(() => {
        ToastAndroid.showWithGravityAndOffset(
          "detected slow internet, trying again...",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
          0,
          20
        );
        getResult(retry, timeout);
      }, 20000);
    } else {
      reject({
        err: "Link is Invalid,Link should look like these  https://pin.it/ ",
      });
    }
  });
};
