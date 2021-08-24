module.exports = (api) => {
  const babelEnv = api.env();
  console.log("babel Env", babelEnv);
  const plugins = [];
  if (babelEnv !== "development") {
    plugins.push("transform-remove-console");
  }
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins,
  };
};
