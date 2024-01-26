// import { getExternalSites, getIsAutoRedirect } from "./getters.js";

// export async function handleAutoRedirect(webRequestDetails) {
//   // prevent prerender (ie. when typing in "g" in the address bar and it prerenders "google.com")
//   if (
//     webRequestDetails.documentLifecycle === "prerender" ||
//       !(await getIsAutoRedirect())
//   ) {
//     return;
//   }
  
//   const sites = await getExternalSites();
//   sites.sort((a, b) => b.isPrivate - a.isPrivate); // sort by private first
//   for (const site of sites) {
//     // replace . with \. and * with .* and force http(s)://
//     const siteRegex = new RegExp(
//       /http(s)?:\/\//.source +
//           site.url.replace(/\./g, "\\.").replace(/\*+/g, ".*")
//     );
//     if (siteRegex.test(webRequestDetails.url)) {
//       browser.tabs.update(webRequestDetails.tabId, {
//         url: site.isPrivate
//           ? "firefox-private:" + webRequestDetails.url
//           : "firefox:" + webRequestDetails.url,
//       });
//       return;
//     }
//   }
// }

// export async function refreshDeclarativeNetRequestRules() {
//   const oldRules = await browser.declarativeNetRequest.getDynamicRules();
//   const newRules = [];
//   const entries = await getExternalSites();
  
//   for (const entry of entries) {
//     const url = entry.url.replace(/\./g, "\\.").replace(/\*+/g, ".*");
//     const rule = {
//       id: entry.id,
//       priority: entry.isPrivate ? 1 : 2,
//       action: {
//         type: "block",
//         redirect: {
//           regexSubstitution: entry.isPrivate ? "firefox-private:\\0" : "firefox:\\0",
//         },
//       },
//       condition: {
//         regexFilter: `http(s)?://${url}`,
//         resourceTypes: ["main_frame"],
//       },
//     };
//     newRules.push(rule);
//   }
  
//   browser.declarativeNetRequest.updateDynamicRules({
//     removeRuleIds: oldRules.map((rule) => rule.id),
//     addRules: newRules,
//   });
// }