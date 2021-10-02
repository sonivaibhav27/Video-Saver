export default function downloadVimeo(url) {
  console.log(url);
  return new Promise((resolve, reject) => {
    if (url.startsWith("https://vimeo.com")) {
      const timeout = setTimeout(() => {
        clearTimeout(timeout);
        reject({
          err:
            "Can't able to fetch results,Please check your internet connection.",
        });
      }, 8000);
      fetch(url, {
        headers: {
          "Cache-Control": "no-store,no-cache",
          "User-Agent": "Mozilla/5.0",
        },
        credentials: "omit",
      })
        .then((response) => {
          if (response.ok) return response.text();
          else {
            reject({ err: "Something went wrong while fetching video." });
          }
        })
        .then((ress) => {
          const indexOfWindow_Script = ress.indexOf(
            "window.vimeo.clip_page_config = "
          );
          const data = ress.indexOf("config_url", indexOfWindow_Script);
          const i = ress.indexOf("%5CClipController", data);
          const url = ress.substring(data, i);
          const cleanURL = url.substring(13).replace(/\\/g, "");
          fetch(cleanURL, {
            headers: {
              "Cache-Control": "no-store,no-cache",
              "User-Agent": "Mozilla/5.0",
            },
          })
            .then((data) => {
              clearTimeout(timeout);
              return data.json();
            })
            .then(function (res) {
              const re = res.request.files.progressive;
              let l = [];
              let q = [];

              re.map((item) => {
                if (q.includes(item.quality)) {
                } else {
                  q.push(item.quality);
                  l.push({
                    q: item.quality,
                    url: item.url,
                    width: item.width,
                    height: item.height,
                  });
                  console.log(l);
                }
              });

              //convert the q string to integer
              l.map((data) => {
                const QualityInstring = data.q;
                const quality = QualityInstring.split("p")[0];
                data.q = +quality;
              });

              resolve({
                data: l,
                image: res.video.thumbs.base + "_640.jpg",
              });
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
                  err: "Something went wrong.",
                  message: err.message,
                });
              }
            });
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
              err: "Something went wrong.",
              message: err.message,
            });
          }
        });
    } else {
      reject({
        err:
          "Link is Invalid,Link should look like these https://vimeo.com/xxxxxxxx",
      });
    }
  });
}
