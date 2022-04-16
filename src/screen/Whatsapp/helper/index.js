import CameraRoll from "@react-native-community/cameraroll";
import Share from "react-native-share";
import RNFetchBlob from "rn-fetch-blob";
import {
  readFile,
  openDocumentTree,
  listFiles,
  getPersistedUriPermissions,
} from "react-native-scoped-storage";
// import {MediaCollection} from "react-native-blob-util"

//custom imports
import { Toast } from "../../../common";
import { Platform, NativeModules } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

const a = NativeModules.CustomNativeModule;
// console.log({ n });
const WhatsappTypes = {
  WHATSAPP_STATUS_PATH: "/sdcard/WhatsApp/Media/.Statuses",
  WHATSAPP_STATUS_SAVE_PATH: "/sdcard/Vidown/WhatsApp Statuses",
  WHATSAPP_STATUS_ANDROID_11:
    "/sdcard/Android/media/com.whatsapp/WhatsApp/Media/.Statuses",
  WHATSAPP_SCOPED:
    "content://com.android.externalstorage.documents/tree/primary%3AAndroid%2Fmedia%2Fcom.whatsapp%2FWhatsApp%2FMedia%2F.Statuses",
  GBWHATSAPP_STATUS_PATH: "/sdcard/GBWhatsApp/Media/.Statuses",
  IMAGE_FILE_FORMATS: [
    "jpg",
    "ani",
    "anim",
    "apng",
    "art",
    "bmp",
    "bpg",
    "bsave",
    "cal",
    "cin",
    "cpc",
    "cpt",
    "dds",
    "dpx",
    "ecw",
    "exr",
    "fits",
    "flic",
    "flif",
    "fpx",
    "gif",
    "hdri",
    "hevc",
    "icer",
    "icns",
    "ico",
    "cur",
    "ics",
    "ilbm",
    "jbig",
    "jbig2",
    "jng",
    "jpeg",
    "jpeg-ls",
    "jpeg",
    "2000",
    "jpeg",
    "xr",
    "jpeg",
    "xt",
    "jpeg-hdr",
    "kra",
    "mng",
    "miff",
    "nrrd",
    "ora",
    "pam",
    "pbm",
    "pgm",
    "ppm",
    "pnm",
    "pcx",
    "pgf",
    "pictor",
    "png",
    "psd",
    "psb",
    "psp",
    "qtvr",
    "ras",
    "rgbe",
    "tiff",
    "sgi",
    "tga",
    "tiff",
    "tiff/ep",
    "tiff/it",
    "ufo/",
    "ufp",
    "wbmp",
    "webp",
    "xbm",
    "xcf",
    "xpm",
    "xwd",
  ],
  VIDEO_FILE_FORMATS: [
    "mp4",
    "m4a",
    "m4v",
    "f4v",
    "f4a",
    "m4b",
    "m4r",
    "f4b",
    "mov",
    "3gp",
    "3gp2",
    "3g2",
    "3gpp",
    "3gpp2",
    "ogg",
    "oga",
    "ogv",
    "ogx",
    "wmv",
    "wma",
    "asf",
    "webm",
    "flv",
    "avi",
  ],
  WHATSAPP_BUSINESS_STATUS_PATH: "/sdcard/WhatsApp Business/Media/.Statuses",
};

const status_dir = [
  WhatsappTypes.WHATSAPP_STATUS_SAVE_PATH,
  WhatsappTypes.WHATSAPP_STATUS_PATH,
  WhatsappTypes.GBWHATSAPP_STATUS_PATH,
  WhatsappTypes.WHATSAPP_BUSINESS_STATUS_PATH,
];
//eslint-disable-next-line no-extend-native
Array.prototype.contains = function (element) {
  for (let i in this) {
    if (this[i] === element) {
      return true;
    }
  }
};

export const getMediaType = (path) => {
  if (path === ".nomedia") {
    return null;
  }
  let split = path.split(".");
  let extension = split[split.length - 1];
  if (WhatsappTypes.VIDEO_FILE_FORMATS.contains(extension)) {
    return "video";
  } else if (WhatsappTypes.IMAGE_FILE_FORMATS.contains(extension)) {
    return "image";
  } else {
    return null;
  }
};

export const checkAndroid11PermissionIfNotThenAsked = (i) => {
  return new Promise(async (resolve, reject) => {
    if (Platform.Version < 30) {
      resolve(true);
    }
    if (i === 0) {
      rejectWithReason(reject, "Please give the permission.");
    }
    try {
      if (
        await RNFetchBlob.fs.exists(WhatsappTypes.WHATSAPP_STATUS_ANDROID_11)
      ) {
        let permissionGot = await openDocumentTree(
          // "content://com.android.externalstorage.documents/tree/primary%3AWhatsApp%2FMedia%2F.Statuses",
          WhatsappTypes.WHATSAPP_SCOPED,
          true
        );
        if (
          permissionGot.uri === null ||
          permissionGot.uri === "" ||
          permissionGot.uri !== WhatsappTypes.WHATSAPP_SCOPED
        ) {
          return await checkAndroid11PermissionIfNotThenAsked(i - 1);
        } else {
          await AsyncStorage.setItem("whatsapp11uri", permissionGot.uri);
          resolve(true);
        }
      } else {
        resolve(true);
      }
    } catch (err) {
      Toast(
        "Something went wrong while fetching permission, Please restart the app and continue",
        "LONG"
      );
      reject(err);
    }
  });
};

const rejectWithReason = (reject, reason) => {
  reject({
    err: {
      message: reason,
    },
  });
};
export async function getUserWhatsapp() {
  return new Promise(async (resolve, reject) => {
    if (Platform.Version >= 30) {
      if (!RNFetchBlob.fs.exists(WhatsappTypes.WHATSAPP_STATUS_ANDROID_11)) {
        rejectWithReason(reject, "Whatsapp not found");
      }
      await listFiles(WhatsappTypes.WHATSAPP_SCOPED)
        .then((res) => {
          let sanitize = res.map((status) => {
            return status.name;
          });
          resolve({ status: sanitize });
        })
        .catch(async (err) => {
          if (
            !(await RNFetchBlob.fs.exists(
              WhatsappTypes.WHATSAPP_STATUS_ANDROID_11
            ))
          ) {
            rejectWithReason(reject, "No Whatsapp Found.");
          }

          console.log(err);
          rejectWithReason(
            reject,
            "Please give permission to continue display your status."
          );
        });
    } else {
      // Make this call in Splash Screen.TODO
      let isExists = false;
      for (let dir of status_dir) {
        RNFetchBlob.fs.exists(dir).then(async (exist) => {
          if (exist) {
            console.log("Exist => ", dir);
            await RNFetchBlob.fs
              .ls(dir)
              .then((status) => {
                console.log(status);
                if (status.length !== 0) {
                  resolve({
                    status,
                    dir,
                  });
                  isExists = true;
                }
              })
              .catch((err) => {
                rejectWithReason(reject, "Error " + JSON.stringify(err));
              });
          }
        });
      }
      if (!isExists) {
        rejectWithReason(reject, "No Whatsapp Found.");
      }
    }
  });
}

export const saveStatus = async (paths, callback, type) => {
  // a.normalizePath(paths).then((d) => {
  //   console.log(d);
  // });
  if (Platform.Version >= 30) {
    try {
      let promises = [];
      let split = paths.split("%2F");
      let fileName = "/" + split[split.length - 1];
      let cachedFileName = RNFetchBlob.fs.dirs.CacheDir + fileName;
      let promise1 = a.copyToInternal(
        paths,
        RNFetchBlob.fs.dirs.CacheDir + fileName
      );
      // alert(promise1);
      // return;
      let promise2 = CameraRoll.save(cachedFileName, {
        type: type === "image" ? "photo" : type,
        album: "Video Saver",
      });
      promises.push(promise1, promise2);
      await Promise.all(promises);
      try {
        await RNFetchBlob.fs.unlink(cachedFileName);
      } catch (err) {}
      callback(`${type} saved to gallery.`);
    } catch (err) {
      console.log(err);
      callback(null, "Something went wrong while downloading.");
    }
  } else {
    CameraRoll.save(paths, {
      type: type === "image" ? "photo" : type,
      album: "Video Saver",
    })
      .then(() => {
        callback(`${type} saved to gallery.`);
      })
      .catch((_) => {
        console.log(_);
        callback(null, "Something went wrong while downloading.");
      });
  }
};

export async function ShareWhatsappStatus(file, ext) {
  try {
    console.log(file);
    const base64 = await readFile(file, "base64");
    if (ext === "video") {
      await Share.open({
        url: `data:video/mp4;base64,${base64}`,
      });
    } else {
      await Share.open({
        url: `data:image/jpeg;base64,${base64}`,
      });
    }
  } catch (error) {
    if (error.message === "User did not share") {
    } else {
      console.log(error);
      Toast("Error: Something went wrong while sharing.");
    }
  }
}
