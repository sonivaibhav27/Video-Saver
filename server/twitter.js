import urlVerifier from "./CheckUrl";

const token =
  "Bearer AAAAAAAAAAAAAAAAAAAAACRSKAEAAAAA2ffOOWbB%2FZ3WUH0e3oPZr9RpRzI%3DflV5o9E0Lbo56pw4K1EOWs6k95xY8L10lYlvraKmuTuH2xTybZ";
const start = "https://api.twitter.com/1.1/statuses/show.json?id=";
const end = "&extended_entities&tweet_mode=extended";
export default (twitterURL) => {
  //return Actual ID from the string.
  return new Promise((resolve, reject) => {
    const isValid = urlVerifier(twitterURL, "twitter");
    if (isValid) {
      const pattern =
        twitterURL.match("/statuses/(.*)") || twitterURL.match("/status/(.*)");
      const id = pattern[1].substring(0, pattern[1].indexOf("?"));
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        reject({
          err:
            "Can't able to fetch results,Please check your internet connection.",
        });
      }, 15000);
      fetch(start + id + end, {
        headers: {
          Authorization: token,
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 12_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 105.0.0.11.118 (iPhone11,8; iOS 12_3_1; en_US; en-US; scale=2.00; 828x1792; 165586599)",
          "Cache-Control": "no-store,no-cache",
        },
        credentials: "omit",
      })
        .then((data) => {
          clearTimeout(timeout);
          if (data.ok) return data.json();
          else {
            reject({
              err: "Something went wrong while fetching the videos.",
            });
          }
        })
        .then((res) => {
          const videos = res.extended_entities.media[0].video_info.variants;
          //   resolve(videos);
          let bitrate = 0;
          for (let video of videos) {
            if (video.content_type !== "video/mp4") {
              continue;
            }
            if (video.bitrate && video.bitrate > bitrate) {
              bitrate = video.bitrate;
            }
          }
          if (bitrate === 0) {
            resolve(videos[0]);
          }
          const findTheItem = videos.find((video) => video.bitrate === bitrate);
          resolve(findTheItem);
        })
        .catch((err) => {
          clearTimeout(timeout);
          if (err.message === "Network request failed") {
            // This is a network error.
            reject({
              err: "Seems like you are not connected to internet.",
              code: 400,
            });
          } else {
            reject({
              err: "Cannot get video url for the following url.",
              message: err.message,
            });
          }
        });
    } else {
      reject({
        err: "Please enter url related to Twitter.",
      });
    }
  });
};
