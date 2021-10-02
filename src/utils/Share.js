import Share from "react-native-share";
import { Toast } from "../common";

export default async (fileName) => {
  try {
    await Share.open({
      url: fileName,
      type: "video/mp4",
      excludedActivityTypes: ["pinterest.ShareExtension"],
    });
  } catch (error) {
    if (error.message === "User did not share") {
    } else {
      Toast("Error: Something went wrong while sharing.");
    }
  }
};
