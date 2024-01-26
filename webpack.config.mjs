import path from "path";

export default {
  entry: {
    chromiumBackground: "./build/chromium/shared/backgroundScripts/background.js",
    chromiumWelcomePage: "./build/chromium/shared/pages/welcomePage/script.js",
    firefoxBackground: "./build/firefox/shared/backgroundScripts/background.js",
    firefoxWelcomePage: "./build/firefox/shared/pages/welcomePage/script.js",
  },
  output: {
    path: path.resolve("build"),
    filename:({ chunk }) => {
      if (chunk.name === "chromiumBackground") {
        return "chromium/background.bundle.js";
      } else if (chunk.name === "chromiumWelcomePage") {
        return "chromium/shared/pages/welcomePage/script.bundle.js";
      } else if (chunk.name === "firefoxBackground") {
        return "firefox/background.bundle.js";
      } else if (chunk.name === "firefoxWelcomePage") {
        return "firefox/shared/pages/welcomePage/script.bundle.js";
      }
    },
  },
  mode: "production",
  devtool: "inline-source-map",
};
