import { launchBrowser } from "./launchBrowser.js";
import { getExternalBrowser } from "../../shared/backgroundScripts/getters.js";

/**
 * Initialize the firefox specific listeners.
 */
export function initPlatformListeners() {
  browser.browserAction.onClicked.addListener(async (tab) => {
    if (launchBrowser(tab)) {
      browser.storage.local.set({
        telemetry: {
          type: "browserLaunch",
          browser: await getExternalBrowser(),
          source: "action_button",
        },
      });
    }
  });
}
