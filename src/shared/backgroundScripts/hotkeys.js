import { launchBrowser } from "../../chromium/interfaces/launchBrowser.js";
import { getExternalBrowser } from "./getters.js";

/**
 * Launches the user set browser on hotkey press.
 * 
 * @param {string} command The command to execute found in the manifest.
 * @param {*} tab The tab object to launch the browser with.
 */
export async function handleHotkeyPress(command, tab) {
  if (command === "launchBrowser") {
    if (await launchBrowser(tab, true)){
      browser.storage.local.set({
        telemetry: {
          type: "browserLaunch",
          browser: await getExternalBrowser(),
          source: "hotkey",
        },
      });
    }
  } else if (command === "launchFirefoxPrivate") {
    if (await launchBrowser(tab, false)){
      browser.storage.local.set({
        telemetry: {
          type: "browserLaunch",
          browser: "Firefox Private Browsing",
          source: "hotkey",
        },
      });
    }
  }
}