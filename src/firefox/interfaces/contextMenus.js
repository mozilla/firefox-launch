/**
 * Initialize the context menus specific to the Firefox Extension.
 */
export async function applyPlatformContextMenus() {
  // External sites context menu
  // browser.contextMenus.create({
  //   id: "separator",
  //   type: "separator",
  //   contexts: ["action"],
  // });
  // browser.contextMenus.create({
  //   id: "addCurrentSiteToMySitesContextMenu",
  //   title: browser.i18n.getMessage("Add_this_site_to_My_Firefox_Sites").replace("[SLD] ", ""),
  //   contexts: ["action"],
  //   enabled: false
  // });
  // browser.contextMenus.create({
  //   id: "autoRedirectCheckboxContextMenu",
  //   title: browser.i18n.getMessage("auto_redirect_my_firefox_sites"),
  //   contexts: ["action"],
  //   type: "checkbox",
  //   checked: await getIsAutoRedirect(),
  // });
  // browser.contextMenus.create({
  //   id: "manageExternalSitesContextMenu",
  //   title: browser.i18n.getMessage("Manage_My_Firefox_Sites"),
  //   contexts: ["action"],
  // });
}

/**
 * Handles the context menu clicka for the Firefox Extension.
 * 
 * @param {Object} info The context menu item info object.
 */
export async function handlePlatformContextMenuClick(info) {
  if (
    info.menuItemId === "openWelcomePage"
  ) {
    browser.tabs.create({
      url: browser.runtime.getURL("shared/pages/welcomePage/index.html"),
    });
  }
}

// Here we mock the functions that are not implemented in Firefox.
export const handleChangeDefaultLaunchContextMenuClick = {};