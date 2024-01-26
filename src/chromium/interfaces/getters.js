import { getExternalBrowser } from "../../shared/backgroundScripts/getters.js";

/**
 * Determines whether Firefox is installed on the system.
 *
 * @returns {Promise<boolean>} True if Firefox is installed on the system, false otherwise.
 */
export async function getIsFirefoxInstalled() {
  const result = await browser.storage.local.get("isFirefoxInstalled");
  if (result.isFirefoxInstalled === undefined) {
    // placeholder
    browser.storage.local.set({ isFirefoxInstalled: true });
    return true;
  } else {
    return result.isFirefoxInstalled;
  }
}

/**
 * Get the non-greyed icon path for Firefox or Firefox Private.
 *
 * @returns {Promise<string>} The path to the non-greyed icon.
 */
export async function getDefaultIconPath() {
  if ((await getExternalBrowser()) === "Firefox") {
    return {
      32: browser.runtime.getURL("images/firefox/firefox32.png"),
    };
  } else {
    return {
      32: browser.runtime.getURL("images/firefox-private/private32.png"),
    };
  }
}

/**
 * Get the greyed icon path for Firefox or Firefox Private.
 *
 * @returns {Promise<string>} The path to the greyed icon.
 */
export async function getGreyedIconPath() {
  if ((await getExternalBrowser()) === "Firefox") {
    return {
      32: browser.runtime.getURL("images/firefox/firefox32grey.png"),
    };
  } else {
    return {
      32: browser.runtime.getURL("images/firefox-private/private32grey.png"),
    };
  }
}
