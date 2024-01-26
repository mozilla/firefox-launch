import { getIsFirefoxInstalled } from "./getters.js";
import { isCurrentTabValidUrlScheme } from "../../shared/backgroundScripts/validTab.js";

/**
 * Launches the Firefox variant. If Firefox is not installed, launch the Firefox download page.
 *
 * @param {*} tab The tab object to launch the browser with.
 * @param {*} launchInFirefox  True if Firefox should launch, false if Firefox Private should launch.
 * @returns {boolean} True if the browser was launched, false otherwise.
 */
export async function launchBrowser(tab, launchInFirefox = true) {
  if (!(await getIsFirefoxInstalled())) {
    browser.tabs.create({ url: "https://www.mozilla.org/firefox/" });
    return false;
  }

  if (isCurrentTabValidUrlScheme) {
    if (launchInFirefox) {
      browser.tabs.update(tab.id, { url: "firefox:" + tab.url });
    } else {
      browser.tabs.update(tab.id, { url: "firefox-private:" + tab.url });
    }
    return true;
  }
  return false;
}
