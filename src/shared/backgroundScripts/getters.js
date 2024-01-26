/**
 * Retreives the name of the browser that opens on action button click.
 *
 * @returns {Promise<string>} The name of the browser.
 */
export async function getExternalBrowser() {
  const result = await browser.storage.sync.get("currentExternalBrowser");
  if (!result || result.currentExternalBrowser === undefined) {
    browser.storage.sync.set({ currentExternalBrowser: "Firefox" });
    return "Firefox";
  } else {
    return result.currentExternalBrowser;
  }
}

/**
 * Retreives whether telemetry is enabled.
 *
 * @returns {Promise<boolean>} True if telemetry is enabled or not specified, false otherwise.
 */
export async function getTelemetryEnabled() {
  const result = await browser.storage.sync.get("telemetryEnabled");
  if (!result || result.telemetryEnabled === undefined) {
    browser.storage.sync.set({ telemetryEnabled: true });
    return true;
  } else {
    return result.telemetryEnabled;
  }
}
// export function getIsAutoRedirect() {
//   return new Promise((resolve) => {
//     browser.storage.local.get(["isAutoRedirect"], (result) => {
//       if (result.isAutoRedirect === undefined) {
//         resolve(true);
//         browser.storage.local.set({ isAutoRedirect: true });
//       } else {
//         resolve(result.isAutoRedirect);
//       }
//     });
//   });
// }

// export function getExternalSites() {
//   return new Promise((resolve) => {
//     browser.storage.sync.get(["firefoxSites"], (result) => {
//       if (result.firefoxSites === undefined) {
//         resolve([]);
//       } else {
//         resolve(result.firefoxSites);
//       }
//     });
//   });
// }

// export function getCurrentTabSLD() {
//   return new Promise((resolve) => {
//     browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//       const currentTab = tabs[0];
//       if (currentTab.url === undefined || !currentTab.url.startsWith("http")) resolve("");

//       try {
//         const url = new URL(tabs[0].url);
//         resolve(url.hostname.split(".").slice(-2).join("."));
//       } catch (e) {
//         resolve("");
//       }
//     });
//   });
// }
