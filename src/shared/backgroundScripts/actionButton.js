import { isCurrentTabValidUrlScheme } from "./validTab.js";
import { getDefaultIconPath, getGreyedIconPath } from "../../chromium/interfaces/getters.js";

/**
 * Updates the toolbar icon to the current default browser icon
 * or a greyed out version of the default browser icon if the
 * current tab is not a valid URL scheme.
 */
export async function updateToolbarIcon() {
  let iconPath = await getDefaultIconPath();
  if (!isCurrentTabValidUrlScheme) {
    iconPath = await getGreyedIconPath();
  }

  // Here for firefox mv2 vs chrome mv3 compatibility
  if (browser.browserAction) {
    browser.browserAction.setIcon({ path: iconPath });
  } else {
    browser.action.setIcon({ path: iconPath });
  }
}
