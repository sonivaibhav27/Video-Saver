import cheerio from "cheerio";
import { ToastAndroid } from "react-native";
import _test_pin from "./_test_pin";

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
        _test_pin(url);
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
        console.log($("script").get());

        let getScript = $("script[id='initial-state']").get()[0]?.children[0]
          .data;
        let contentToJson, responseFromPins;
        if (getScript == null) {
          getScript = $("script[id='__PWS_DATA__']").get()[0].children[0].data;
          contentToJson = JSON.parse(getScript);
          // responseFromPins = contentToJson.props;
          console.log(contentToJson);
        } else {
          contentToJson = JSON.parse(getScript);
          console.log(contentToJson);
          responseFromPins = contentToJson.pins;
        }
        // console.log(getScript);

        const urls = [];
        if (contentToJson.storyPins) {
          const responseFromStoryPins = contentToJson.storyPins;

          const getStoryPinId = Object.keys(responseFromStoryPins);
          if (getStoryPinId.length) {
            console.log({ response: responseFromStoryPins[getStoryPinId[0]] });
            const pages = responseFromStoryPins[getStoryPinId[0]].pages;

            console.log({
              url: pages,
            });

            pages.forEach((page) => {
              const endpoint = page.blocks[0].video?.video_list.V_EXP7;
              if (endpoint !== undefined) {
                urls.push({
                  video: endpoint.url,
                  poster_image: endpoint.thumbnail,
                });
              }
            });
            if (urls.length === 1) {
              resolve({
                url: urls[0].video,
                isMultiple: false,
              });
            } else if (urls.length > 1) {
              resolve({
                url: urls,
                isMultiple: true,
              });
            }
          }
        }

        const fromPinResources = contentToJson.resources;
        console.log(fromPinResources);
        if (Object.keys(fromPinResources).length > 0) {
          if (fromPinResources.UserResource) {
            if (fromPinResources.UserResource["user_id=null"]?.error?.message) {
              reject({
                err: "No Videos found.",
              });
            }
          }
          if (fromPinResources.PinResource) {
            const key = Object.keys(fromPinResources.PinResource);
            if (key.length) {
              const dataNode = fromPinResources.PinResource[key].data;
              if (
                dataNode !== undefined &&
                dataNode != null &&
                dataNode.videos != null &&
                dataNode.videos.video_list != null
              ) {
                Object.values(dataNode.videos.video_list).forEach((item) => {
                  if (item.url && item.url.indexOf(".mp4") !== -1) {
                    console.log({
                      url: item.url,
                    });
                    urls.push(item.url);
                  }
                });
              }
            }
          }
        }
        if (urls.length === 1) {
          resolve({
            url: urls[0],
            isMultiple: false,
          });
        } else if (urls.length > 1) {
          resolve({
            url: urls,
            isMultiple: true,
          });
        }
        console.log({ urls });

        console.log("Here");
        const keysOfResponseFromPins = Object.keys(responseFromPins);
        if (keysOfResponseFromPins.length) {
          const videos_ = responseFromPins[keysOfResponseFromPins[0]].videos;
          console.log({ videos_ });
          if (videos_) {
            Object.values(videos_.video_list).forEach((item) => {
              if (item.url && item.url.indexOf(".mp4") !== -1) {
                console.log({
                  url: item.url,
                });
                urls.push({
                  url: item.url,
                });
              }
            });
          } else {
            reject({ err: "No video found." });
          }
        }
        if (urls.length === 1) {
          resolve({
            url: urls[0],
            isMultiple: false,
          });
        } else if (urls.length > 1) {
          resolve({
            url: urls,
            isMultiple: true,
          });
        } else {
          reject({ err: "No Video found" });
        }
      } catch (err) {
        console.log(err);
        clearTimeout(retryTimeout);
        clearTimeout(timeout);
        if (err.message === "Network request failed") {
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

    if (url.startsWith("https://pin.it/") || url.indexOf("pinterest") !== -1) {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        clearTimeout(retry);
        reject({
          err:
            "Can't able to fetch results, Please check your internet connection.",
        });
      }, 40000);

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
      getResult(retry, timeout);
    } else {
      reject({
        err: "Link is Invalid,Link should look like these  https://pin.it/ ",
      });
    }
  });
};
