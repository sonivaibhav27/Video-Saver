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

const checkForPossibleVideoSite = (html) => {
  const possibles = [
    '<meta property="og:video:url"',
    '<meta property="og:video:secure_url"',
    "sd_src_no_ratelimit",
    "sd_src",
  ];

  const hdPossible = ["hd_src_no_ratelimit", "hd_src"];

  let urls = {
    sd: null,
    hd: null,
  };
  for (let i = 0; i < possibles.length; i++) {
    if (i === 2 || i === 3) {
      const regex = new RegExp(`${possibles[i]}:"(.+?)"`);
      const exists = html.match(regex);
      console.log({ exists });
      if (exists != null) {
        urls.sd = exists[1].replace(/&amp;/g, "&");
        break;
      }
    } else {
      const regex = new RegExp(`${possibles[i]} content="(.+?)"`);
      const exists = html.match(regex);
      console.log({ exists });
      if (exists != null) {
        urls.sd = exists[1].replace(/&amp;/g, "&");
        break;
      }
    }
  }
  for (let i = 0; i < hdPossible.length; i++) {
    const regex = new RegExp(`${hdPossible[i]}:"(.+?)"`);
    const exists = html.match(regex);
    console.log({ exists });
    if (exists != null) {
      urls.hd = exists[1].replace(/&amp;/g, "&");
      return urls;
    }
  }
  if (urls.sd != null) {
    urls.hd = urls.sd;
    return urls;
  }
  return null;
};

export default function downloadFb(url) {
  // getDataFromURI();
  return new Promise((resolve, reject) => {
    // alert(JSON.stringify(result));
    const getResult = (retryTimeout, timeout) => {
      fetch(url, {
        redirect: "follow",
        headers: {
          "User-Agent": uagents[0],
          accept: "*/*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
          "sec-ch-ua":
            '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "cross-site",
        },
        referrer: "https://www.facebook.com/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
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
          const downloadUrl = checkForPossibleVideoSite(html);
          // console.log({
          //   downloadUrl,
          // });
          if (downloadUrl == null) {
            console.log("inside");
            reject({
              err:
                "This video is private, can't be downloaded without logged in.",
              code: 400,
            });
          } else {
            console.log("exit.");
            console.log({ downloadUrl });

            resolve({ url: downloadUrl.sd, hd: downloadUrl.hd });
          }
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
      }, 40000);
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
