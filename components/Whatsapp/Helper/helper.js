import RNFetchBlob from "rn-fetch-blob";
import { status_dir } from "../Constants";

export async function getUserWhatsapp() {
  return new Promise(async (resolve, reject) => {
    // Make this call in Splash Screen.TODO
    let isExists = false;
    for (let dir of status_dir) {
      await RNFetchBlob.fs.exists(dir).then((exist) => {
        if (exist) {
          RNFetchBlob.fs
            .ls(dir)
            .then((status) => {
              if (status.length != 0) {
                resolve({
                  status,
                  dir,
                });
                isExists = true;
              }
            })
            .catch((err) => {
              reject({
                err: {
                  message: "Error " + JSON.stringify(err),
                },
              });
            });
        }
      });
    }
    if (!isExists) {
      reject({
        err: {
          message: "No Whatsapp Found.",
        },
      });
    }
    // getInitialWhatsapp()
    //   .then(async (dir) => {
    //     // await AsyncStorage.setItem('Dir', dir);
    //     RNFetchBlob.fs
    //       .ls(dir)
    //       .then((status) => {
    //         resolve({
    //           status,
    //           dir,
    //         });
    //       })
    //       .catch((err) => {
    //         reject({
    //           message:
    //             "Something went wrong, while fetching records from " + err,
    //         });
    //       });
    //   })
    //   .catch((err) => {
    //     reject(err);
    //   });
  });
}
