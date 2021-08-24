import urlVerifier from "./CheckUrl";
const uagents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.47 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59",
];

const u = "https://fb.watch/6r9Y6PPAFu/";

function RejectError(reject, err) {
  if (err.message === "Network request failed") {
    // This is a network error.
    reject({
      err: "Seems like you are not connected to internet.",
      code: 400,
    });
  } else {
    reject({
      err: "Something went wrong.",
      message: err.message,
      code: 400,
    });
  }
}

export default function downloadFb(url) {
  return new Promise((resolve, reject) => {
    const getResult = (retryTimeout, timeout) => {
      fetch(url, {
        redirect: "follow",
        headers: {
          "Cache-Control": "no-store,no-cache",
          "User-Agent": uagents[0],
        },
      })
        .then((response) => {
          if (response.url.indexOf("login/?next=") != -1) {
            console.log("[INSIDE RESPONSE]");
            const filtered = response.url.substring(
              response.url.indexOf("next=") + 5
            );

            const decodedUri = decodeURIComponent(filtered).replace(
              "https://m.",
              "https://www."
            );

            fetch(decodedUri, {
              redirect: "follow",
              headers: {
                "Cache-Control": "no-store,no-cache",
                "User-Agent":
                  uagents[
                    Math.round(Math.random() * uagents.length) % uagents.length
                  ],
              },
            })
              .then((data) => {
                return data.text();
              })
              .catch((err) => {
                clearTimeout(retryTimeout);
                clearTimeout(timeout);
                RejectError(reject, err);
              });
          }
          clearTimeout(retryTimeout);
          clearTimeout(timeout);
          return response.text();
        })
        .then(async (html) => {
          const startIndex = html.indexOf('<meta property="og:video:url"');

          if (startIndex == -1) {
            reject({
              err:
                "This video is private, can't be downloaded without logged in.",
              code: 400,
            });
          }
          const lastIndex = html.indexOf("/>", startIndex);

          const d = html.substring(startIndex + 39, lastIndex - 2);
          if (d.replace(/&amp;/g, "&").indexOf("<!DOCTYPE html") != -1) {
            console.log("[INSIDE]");

            reject({
              err: "You must be logged in to download this video.",
              code: 400,
            });
          }
          resolve({ url: d.replace(/&amp;/g, "&").trim() });

          // resolve({ url: html.substring(startIndex + 34, lastIndex - 1) });
        })
        .catch((err) => {
          clearTimeout(retryTimeout);
          clearTimeout(timeout);
          RejectError(reject, err);
        });
    };
    const isValid = urlVerifier(url, "facebook");

    if (isValid) {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        reject({
          err:
            "Can't able to fetch results,Please check your internet connection.",
        });
      }, 20000);
      const retry = setTimeout(() => {
        getResult(retry, timeout);
      }, 10000);

      getResult(retry, timeout);
    } else {
      reject({
        err:
          "Link is Invalid,Link should start with https://www.facebook.com/ or https://fb.watch/",
      });
    }
  });
}
