export default (url, domain) => {
  const isUrl =
    url.startsWith(`https://www.${domain}.com`) ||
    url.startsWith("https://fb.watch") ||
    url.startsWith(`https://${domain}.com`) ||
    url.startsWith(`https://twitter.com`) ||
    url.startsWith("https://fb.gg");
  if (isUrl) {
    return true;
  } else {
    return false;
  }
};
