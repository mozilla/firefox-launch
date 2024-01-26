export let isCurrentTabValidUrlScheme = false;

/**
 * Checks if the given tab has a valid url scheme. If so, updates the global variable 
 * isCurrentTabValidUrlScheme to true. Otherwise, updates it to false.
 * 
 * @param {*} tab The tab to check the url scheme of.
 */
export function checkAndUpdateURLScheme(tab) {
  if (
    tab.url === undefined ||
    tab.url.startsWith("http") ||
    tab.url.startsWith("file")
  ) {
    isCurrentTabValidUrlScheme = true;
  } else {
    isCurrentTabValidUrlScheme = false;
  }
}

/**
 * Sets the global variable isCurrentTabValidUrlScheme to the given boolean.
 * For use in tests.
 * 
 * @param {boolean} bool The boolean to set the global variable to.
 */
export const setIsCurrentTabValidUrlScheme = (bool) => {
  isCurrentTabValidUrlScheme = bool;
};
