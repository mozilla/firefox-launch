const isChromium = browser.runtime.getManifest().minimum_chrome_version;

export function replaceMessage(element, l10nID, href) {
  let message = browser.i18n.getMessage(l10nID);
  if (!message) {
    return false;
  }

  message = message.replace("{LinkStart}", `<a id="${l10nID}Link" href="">`);
  message = message.replace("{LinkEnd}", "</a>");

  // eslint-disable-next-line no-unsanitized/property
  element.innerHTML = message;

  // add a listener to the link if required
  if (href) {
    const link = document.getElementById(`${l10nID}Link`);
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (href.startsWith("addons://")) {
        browser.experiments.firefox_launch.openPrivilegedUrl(href);
      } else {
        browser.tabs.create({
          url: href,
        });
      }
    });
  }

  return true;
}

/**
 * Replace the innerHTML of an element with the localized string.
 *
 * @param {string} id The id of the element in the HTML to replace.
 * @param {string} href The href to use for the link listener if required.
 * @param {string} platform The platform to append to the id if required.
 *
 * @returns {boolean} True if the element was found and replaced, false otherwise.
 */
export function replaceDataLocale(id, href, platform = "") {
  const element = document.querySelector(`[data-locale="${id}"]`);
  if (!element) {
    return false;
  }

  return replaceMessage(element, `${id}${platform}`, href);
}

/**
 * Apply localization to the page.
 */
export function applyLocalization() {
  const elements = document.querySelectorAll("[data-locale]");
  const hrefMapping = {
    welcomePageManageShortcutsChromium: "chrome://extensions/shortcuts",
    welcomePageManageShortcutsFirefox: "addons://shortcuts/shortcuts",
    welcomePageErrorChromium: "https://www.mozilla.org/en-CA/firefox/new/",
    privacyNoticeLink: "",
  };

  // attempt to replace each element
  elements.forEach((element) => {
    const localeId = element.getAttribute("data-locale");

    // attempt to replace the element with the localized string
    if (replaceDataLocale(localeId, hrefMapping[localeId])) {
      return;
    }

    // attempt to replace platform specific elements
    if (isChromium) {
      const platform = "Chromium";
      replaceDataLocale(localeId, hrefMapping[localeId + platform], platform);
    } else {
      const platform = "Firefox";
      replaceDataLocale(localeId, hrefMapping[localeId + platform], platform);
    }
  });
}
