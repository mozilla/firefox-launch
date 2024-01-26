import * as _ from "../../../browser-polyfill.js";

import {
  getExternalBrowser,
  getTelemetryEnabled,
} from "../../backgroundScripts/getters.js";

import { applyLocalization, replaceMessage } from "./localization.js";
import { populateBrowserList } from "./browserList.js";
import { getIsFirefoxInstalled } from "../../../chromium/interfaces/getters.js";
import { handleChangeDefaultLaunchContextMenuClick } from "../../../chromium/interfaces/contextMenus.js";

const isChromium = browser.runtime.getManifest().minimum_chrome_version;

/**
 * Check the private browsing checkbox if the current external browser is
 * Firefox Private Browsing. Add a listener to update the default launch mode.
 */
export async function checkPrivateBrowsing() {
  const alwaysPrivateCheckbox = document.getElementById(
    "always-private-checkbox"
  );
  const currentExternalBrowser = await getExternalBrowser();
  if (currentExternalBrowser === "Firefox Private Browsing") {
    alwaysPrivateCheckbox.checked = true;
  } else {
    alwaysPrivateCheckbox.checked = false;
  }

  // On change, update the default launch mode
  alwaysPrivateCheckbox.addEventListener("change", async () => {
    let from = await getExternalBrowser();
    await handleChangeDefaultLaunchContextMenuClick();
    let to = await getExternalBrowser();

    if (to === "Firefox Private Browsing") {
      alwaysPrivateCheckbox.checked = true;
    } else {
      alwaysPrivateCheckbox.checked = false;
    }

    browser.storage.local.set({
      telemetry: {
        type: "currentBrowserChange",
        from,
        to,
        source: "welcome_page",
      },
    });
  });
}

/**
 * Update the telemetry checkbox and initialize the listener.
 */
export async function updateTelemetry() {
  // check storage to see if telemetry is enabled/disabled. If neither, set to true.
  const telemetryEnabled = await getTelemetryEnabled();
  browser.storage.sync.set({ telemetryEnabled });
  document.getElementById("telemetry-checkbox").checked = telemetryEnabled;

  document
    .getElementById("telemetry-checkbox")
    .addEventListener("change", async () => {
      const telemetryEnabled = await getTelemetryEnabled();
      browser.storage.sync.set({ telemetryEnabled: !telemetryEnabled });
    });
}

/**
 * Check the hotkeys for the browser launch and let the user know if
 * they are not set.
 */
export async function checkFirefoxHotkeys() {
  // get hotkeys with id launchBrowser
  const hotkeys = await browser.commands.getAll();
  const launchBrowser = hotkeys.find(
    (hotkey) => hotkey.name === "launchBrowser"
  );

  const shortcutsList = document.getElementById("shortcuts-list");

  const p = document.createElement("p");
  shortcutsList.appendChild(p);
  if (launchBrowser.shortcut) {
    let launchBrowserHotkey = launchBrowser.shortcut;

    // convert Ctrl to Cmd on Mac and command to cmd on Mac
    if ((await browser.runtime.getPlatformInfo()).os === "mac") {
      launchBrowserHotkey = launchBrowserHotkey.replace("Ctrl", "CMD");
      launchBrowserHotkey = launchBrowserHotkey.replace("Command", "CMD");
    }

    p.id = "launch-browser-shortcut";
    p.innerText = browser.i18n.getMessage("welcomePageYesShortcutTo", [
      launchBrowserHotkey.toUpperCase(),
      await getExternalBrowser(),
    ]);
  } else {
    replaceMessage(p, "welcomePageNoShortcutsFirefox", "addons://shortcuts/shortcuts");

    // remove the manage shortcuts text
    const manageShortcutsText = document.querySelector(
      "[data-locale='welcomePageManageShortcuts']"
    );
    manageShortcutsText.remove();
  }
}

/**
 * Check the hotkeys for the browser launch and let the user know if
 * they are not set.
 *
 * Also add a link to the chromium shortcuts page.
 */
export async function checkChromiumHotkeys() {
  const hotkeys = await browser.commands.getAll();
  const launchBrowser = hotkeys.find(
    (hotkey) => hotkey.name === "launchBrowser"
  );
  const launchFirefoxPrivate = hotkeys.find(
    (hotkey) => hotkey.name === "launchFirefoxPrivate"
  );

  const shortcutsList = document.getElementById("shortcuts-list");

  // if there are no shortcuts, display a message
  if (!launchBrowser.shortcut && !launchFirefoxPrivate.shortcut) {
    const preamble = document.createElement("p");
    shortcutsList.appendChild(preamble);
    replaceMessage(
      preamble,
      "welcomePageNoShortcutsChromium",
      "chrome://extensions/shortcuts"
    );

    // remove the manage shortcuts text
    const manageShortcutsText = document.querySelector(
      "[data-locale='welcomePageManageShortcuts']"
    );
    manageShortcutsText.remove();
    return;
  }

  // Display a message for the Firefox shortcut
  const span = document.createElement("span");
  span.classList.add("shortcut-item");
  if (launchBrowser.shortcut) {
    const launchBrowserHotkey = launchBrowser.shortcut;
    span.innerText =
      browser.i18n.getMessage("welcomePageYesShortcutTo", [
        launchBrowserHotkey.toUpperCase(),
        await getExternalBrowser(),
      ]) + "\n";
  } else {
    span.innerText =
      browser.i18n.getMessage("welcomePageNoShortcutTo", ["Firefox"]) + "\n";
  }
  shortcutsList.appendChild(span);

  // Display a message for the Firefox private shortcut
  const span2 = document.createElement("span");
  span2.classList.add("shortcut-item");
  if (launchFirefoxPrivate.shortcut) {
    const launchFirefoxPrivateHotkey = launchFirefoxPrivate.shortcut;
    span2.innerText =
      browser.i18n.getMessage("welcomePageYesShortcutTo", [
        launchFirefoxPrivateHotkey.toUpperCase(),
        "Firefox private browsing",
      ]) + "\n";
  } else {
    span2.innerText =
      browser.i18n.getMessage("welcomePageNoShortcutTo", [
        "Firefox private browsing",
      ]) + "\n";
  }
  shortcutsList.appendChild(span2);
}

/**
 * Add or remove certain elements from the page depending on the platform.
 */
export async function activatePlatformSpecificElements() {
  if (isChromium) {
    // remove objects with class firefox from the page
    const firefoxElements = document.getElementsByClassName("firefox");
    const firefoxElementsArray = Array.from(firefoxElements);
    firefoxElementsArray.forEach((element) => {
      element.remove();
    });
    checkChromiumHotkeys();
    checkPrivateBrowsing();
    if (browser.runtime.getPlatformInfo().os === "android") {
      applyMobileLogic();
    }
    if (!(await getIsFirefoxInstalled())) {
      document.getElementById("error-notification").style.display = "flex";
    }
  } else {
    // remove objects with class chromium
    const chromiumElements = document.getElementsByClassName("chromium");
    const chromiumElementsArray = Array.from(chromiumElements);
    chromiumElementsArray.forEach((element) => {
      element.remove();
    });
    populateBrowserList();
    checkFirefoxHotkeys();
  }
}

/**
 * Apply logic for mobile browsers.
 */
export function applyMobileLogic() {
  // move the manage shortcuts text to the bottom of the description and
  // remove the shortcuts container.
  const manageShortcutsText = document.querySelector(
    "[data-locale='welcomePageManageShortcuts']"
  );

  document
    .querySelector("[data-locale='welcomePageDescription']")
    .insertAdjacentElement("afterend", manageShortcutsText);

  const shortcutsContainer = document.getElementById("shortcuts-container");
  shortcutsContainer.remove();
}

document.addEventListener("DOMContentLoaded", function() {
  activatePlatformSpecificElements();
  applyLocalization();
  updateTelemetry();

  // hide the error on close
  document.getElementById("close-button").addEventListener("click", () => {
    document.getElementById("error-notification").classList.add("hidden");
  });
});
