import { launchBrowser } from "../../chromium/interfaces/launchBrowser.js";
import { getExternalBrowser } from "./getters.js";

import {
  applyPlatformContextMenus,
  handlePlatformContextMenuClick,
} from "../../chromium/interfaces/contextMenus.js";

/**
 * Initialize the context menua. This includes the page context menu, link context menu,
 * and platform specific context menus.
 */
export async function initContextMenu() {
  const externalBrowser = await getExternalBrowser();
  // if we're in chromium, ensure we force Firefox as the option, otherwise use the default
  const defaultLaunchMode = browser.runtime.getManifest().minimum_chrome_version
    ? "Firefox"
    : externalBrowser;

  // page context menu
  browser.contextMenus.create({
    id: "launchInExternalBrowser",
    title: browser.i18n.getMessage(
      "launchInExternalBrowser",
      defaultLaunchMode
    ),
    contexts: ["page"],
  });

  // link context menu
  browser.contextMenus.create({
    id: "launchInExternalBrowserLink",
    title: browser.i18n.getMessage(
      "launchInExternalBrowserLink",
      defaultLaunchMode
    ),
    contexts: ["link"],
  });

  const action = browser.action ? "action" : "browser_action"; // mv2 vs mv3
  //separator
  browser.contextMenus.create({
    id: "separator",
    type: "separator",
    contexts: [action],
  });

  // platform specific menu
  await applyPlatformContextMenus();

  //separator
  browser.contextMenus.create({
    id: "separator2",
    type: "separator",
    contexts: [action],
  });

  // action menu welcome page
  browser.contextMenus.create({
    id: "openWelcomePage",
    title: browser.i18n.getMessage("openWelcomePage"),
    contexts: [action],
  });
}

/**
 * Update the context menu titles on browser name change.
 */
export async function handleBrowserNameChange() {
  const externalBrowser = await getExternalBrowser();
  // if we're in chromium, ensure we force Firefox as the option, otherwise use the default
  const defaultLaunchMode = browser.runtime.getManifest().minimum_chrome_version
    ? "Firefox"
    : externalBrowser;

  browser.contextMenus.update("launchInExternalBrowser", {
    title: browser.i18n.getMessage(
      "launchInExternalBrowser",
      defaultLaunchMode
    ),
  });
  browser.contextMenus.update("launchInExternalBrowserLink", {
    title: browser.i18n.getMessage(
      "launchInExternalBrowserLink",
      defaultLaunchMode
    ),
  });
}

/**
 * Handles the context menu item clicks. Redirects to the proper handler.
 *
 * @param {Object} info The context menu item object.
 * @param {Object} tab The current tab object.
 */
export async function handleContextMenuClick(info, tab) {
  if (info.menuItemId === "launchInExternalBrowser") {
    if (await launchBrowser(tab)) {
      browser.storage.local.set({
        telemetry: {
          type: "browserLaunch",
          browser: await getExternalBrowser(),
          source: "page_context_menu",
        },
      });
    }
  } else if (info.menuItemId === "launchInExternalBrowserLink") {
    tab.url = info.linkUrl;
    if (await launchBrowser(tab)) {
      browser.storage.local.set({
        telemetry: {
          type: "browserLaunch",
          browser: await getExternalBrowser(),
          source: "link_context_menu",
        },
      });
    }
  } else if (info.menuItemId === "openWelcomePage") {
    browser.tabs.create({
      url: browser.runtime.getURL("shared/pages/welcomePage/index.html"),
    });
  } else {
    await handlePlatformContextMenuClick(info, tab);
  }
  // } else if (info.menuItemId === "manageExternalSitesContextMenu") {
  //   browser.tabs.create({
  //     url: "pages/myFirefoxSites/index.html",
  //   });
  // } else if (info.menuItemId === "autoRedirectCheckboxContextMenu") {
  //   handleAutoRedirectCheckboxContextMenuClick();
  // } else if (info.menuItemId === "addCurrentSiteToMySitesContextMenu") {
  //   await handleAddCurrentSiteToMySitesContextMenuClick();
  // }
}

// export async function handleAutoRedirectCheckboxContextMenuClick() {
//   const isAutoRedirect = await getIsAutoRedirect();

//   // If disabling, remove all rules and keep them in storage
//   // If enabling, add all rules from storage
//   if (isAutoRedirect) {
//     browser.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: (await browser.declarativeNetRequest.getDynamicRules()).map(
//         (rule) => rule.id
//       ),
//     });
//   } else {
//     await refreshDeclarativeNetRequestRules();
//   }
//   browser.storage.local.set({ isAutoRedirect: !isAutoRedirect });
// }

// export async function handleAddCurrentSiteToMySitesContextMenuClick() {
//   const sld = await getCurrentTabSLD();
//   if (sld === "") return;
//   browser.storage.sync.get(["firefoxSites"], (result) => {
//     const entries = result.firefoxSites || [];
//     // if entries is empty, default to 1 for id. otherwise, increment the id
//     const newEntry = {
//       id: entries.length === 0 ? 1 : entries[entries.length - 1].id + 1,
//       url: `*.${sld}/*`,
//       isPrivate: false,
//     };

//     // don't add dupes
//     if (entries.find((entry) => entry.url === newEntry.url)) return;
//     entries.push(newEntry);
//     browser.storage.sync.set({ firefoxSites: entries });
//   });
// }

// export async function updateAddCurrentSiteToMySitesContextMenu() {
//   if (await getCurrentTabSLD() !== "") {
//     browser.contextMenus.update("addCurrentSiteToMySitesContextMenu", {
//       title: browser.i18n.getMessage("Add_this_site_to_My_Firefox_Sites").replace("[SLD]", await getCurrentTabSLD()),
//       enabled: true
//     });
//   } else {
//     browser.contextMenus.update("addCurrentSiteToMySitesContextMenu", {
//       title: browser.i18n.getMessage("Add_this_site_to_My_Firefox_Sites").replace("[SLD] ", ""),
//       enabled: false
//     });
//   }
// }
