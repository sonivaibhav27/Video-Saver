import CameraRoll from "@react-native-community/cameraroll";
export const WhatsappTypes = {
  WHATSAPP_STATUS_SAVE_PATH: "/sdcard/Vidown/WhatsApp Statuses",
  WHATSAPP_STATUS_ANDROID_11:
    "/sdcard/Android/media/com.whatsapp/WhatsApp/Media/.Statuses",
  WHATSAPP_STATUS_PATH: "/sdcard/WhatsApp/Media/.Statuses",
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
Array.prototype.contains = function (element) {
  for (let i in this) {
    if (this[i] == element) {
      return true;
    }
  }
};

export const getMediaType = (path) => {
  if (path == ".nomedia") {
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
export let status_dir = [
  WhatsappTypes.WHATSAPP_STATUS_PATH,
  WhatsappTypes.WHATSAPP_STATUS_ANDROID_11,
  WhatsappTypes.GBWHATSAPP_STATUS_PATH,
  WhatsappTypes.WHATSAPP_BUSINESS_STATUS_PATH,
];

export const saveStatus = async (paths, fileName, callback, type) => {
  CameraRoll.save(paths, {
    type: type == "image" ? "photo" : type,
    album: "Video Saver",
  })
    .then(() => {
      callback(`${type} saved to gallery.`);
    })
    .catch((_) => {
      callback(null, "Something went wrong while downloading.");
    });
};
