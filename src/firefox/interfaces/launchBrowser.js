import { isCurrentTabValidUrlScheme } from "../../shared/backgroundScripts/validTab.js";
import { getExternalBrowserLaunchProtocol } from "./getters.js";

/**
 * Launches the user set browser. If the browser is not set, launch the welcome page.
 * 
 * @param {*} tab The tab object to launch the browser with.
 * @returns {boolean} True if the browser was launched, false otherwise.
 */
export async function launchBrowser(tab) {
  if (isCurrentTabValidUrlScheme) {
    const launchProtocol = await getExternalBrowserLaunchProtocol();
    if (launchProtocol) {
      browser.experiments.firefox_launch.launchApp(launchProtocol, [tab.url]);
      return true;
    } else {
      browser.tabs.create({ url: browser.runtime.getURL("shared/pages/welcomePage/index.html") });
    }
  }
  return false;
}