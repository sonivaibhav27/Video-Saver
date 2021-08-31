import cheerio from "cheerio";
import { ToastAndroid } from "react-native";

const header = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.67",
  },
  redirect: "follow",
};
export default (url: string) => {
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
        const getScript = $('script[id="initial-state"]').get()[0].children[0]
          .data;
        const contentToJson = JSON.parse(getScript);
        const response = contentToJson.resourceResponses[0].response.data;
        console.log("response => ", response);
        if (response.story_pin_data) {
          let l = [];
          Object.keys(response.story_pin_data.pages).map((_, i) => {
            const video_end = response.story_pin_data.pages[i].blocks[0].video;
            if (video_end) {
              l.push({
                video: video_end.video_list.V_EXP6.url,
                poster_image: video_end.video_list.V_EXP6.thumbnail,
              });
            }
          });
          if (l.length == 0) {
            reject({ err: "No videos  found from this pin. " });
          } else if (l.length == 1) {
            resolve({
              url: l[0].video,
              isMultiple: false,
            });
          } else {
            resolve({
              url: l,
              isMultiple: true,
            });
          }
        } else if (response.videos) {
          resolve({
            url: response.videos.video_list.V_720P.url,
            isMultiple: false,
          });
        } else if (response.images) {
          reject({ err: "No Video Found." });
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
