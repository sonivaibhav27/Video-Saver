import Cookie from "react-native-cookie";

const domainToWebsite = (domain) => {
  return domain === "instagram"
    ? "https://www.instagram.com"
    : "https://m.facebook.com";
};

export const getCookie = async (domain) => {
  const website = domainToWebsite(domain);
  try {
    const cookie = await Cookie.get(website);
    return cookie;
  } catch (_) {
    throw new Error("Cookie not found.");
  }
};

export const clearCookie = async (domain) => {
  const website = domainToWebsite(domain);
  try {
    await Cookie.clear(website);
    return true;
  } catch (_) {
    throw new Error("failed to clear error");
  }
};
