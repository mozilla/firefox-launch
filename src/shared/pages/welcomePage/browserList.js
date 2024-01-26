import { getExternalBrowser } from "../../backgroundScripts/getters.js";

/**
 * Populate the browser list with the available browsers.
 */
export async function populateBrowserList() {
  let browserList = document.getElementById("browser-select");
  browserList.innerHTML = "";

  const availableBrowsers = await browser.experiments.firefox_launch.getAvailableBrowsers();

  // console.group("Experimental Api Logs");
  // availableBrowsers.logs.forEach((log) => {
  //   console.log(log);
  // });
  // console.groupEnd();

  // if no browsers are available, remove the browser-list element and display a message
  if (availableBrowsers.browsers.length === 0) {
    document.getElementById("browser-list-container").remove();
    document.getElementById("error-notification").style.display = "flex";
    document.getElementById("shortcuts-list").remove();
    return;
  }

  // sort browsers by name alphabetically and remove duplicate names
  const loadedBrowsers = new Set();
  const browsers = availableBrowsers.browsers
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((localBrowser) => {
      if (loadedBrowsers.has(localBrowser.name)) {
        return false;
      } else {
        loadedBrowsers.add(localBrowser.name);
        return true;
      }
    });

  const defaultBrowserName = await browser.experiments.firefox_launch
    .getDefaultBrowser()
    .then((localBrowser) => localBrowser.name);

  // add browsers to the list
  browsers.forEach((localBrowser) => {
    const option = document.createElement("option");
    option.value = localBrowser.name;

    // if it's the user's default browser, add a message to the option
    const isDefaultBrowser = defaultBrowserName === localBrowser.name;
    if (isDefaultBrowser) {
      option.text = `${localBrowser.name} ${browser.i18n.getMessage(
        "welcomePageDefaultBrowser"
      )}`;
    } else {
      option.text = localBrowser.name;
    }

    option.setAttribute("data-launch-protocol", localBrowser.executable);
    browserList.appendChild(option);
  });

  // On change, update the current external browser.
  browserList.addEventListener("change", async (event) => {
    const oldBrowserName = await getExternalBrowser();
    const newBrowserName = event.target.value;
    const executable = event.target.selectedOptions[0].getAttribute(
      "data-launch-protocol"
    );

    // update launch-browser-shortcut
    const launchBrowserShortcutElement = document.getElementById(
      "launch-browser-shortcut"
    );
    launchBrowserShortcutElement.innerText = launchBrowserShortcutElement.innerText.replace(
      oldBrowserName,
      newBrowserName
    );

    browser.storage.local.set({
      currentExternalBrowserLaunchProtocol: executable,
    });
    browser.storage.sync.set({ currentExternalBrowser: newBrowserName });

    browser.storage.local.set({
      telemetry: {
        type: "currentBrowserChange",
        from: oldBrowserName,
        to: newBrowserName,
      },
    });
  });

  // Now select the proper browser.

  // In order of priority:
  // Select the current browser.
  // Select the default browser.
  // Select Safari on Mac and Edge on Windows.
  // Select the first browser in the list.
  // If there are no browsers, remove the list and display a message.
  const platform = (await browser.runtime.getPlatformInfo()).os;
  const currentBrowser = await getExternalBrowser();

  if (currentBrowser !== "Firefox") {
    browserList.value = currentBrowser;
  } 
  
  else if (defaultBrowserName) {
    browserList.value = defaultBrowserName;
    browserList.dispatchEvent(new Event("change"));
  } 
  
  else if (platform === "mac") {
    const safari = browsers.find(
      (localBrowser) => localBrowser.name === "Safari"
    );
    if (safari) {
      browserList.value = safari.name;
      browserList.dispatchEvent(new Event("change"));
    }
  } 
  
  else if (platform === "win") {
    const edge = browsers.find((localBrowser) => localBrowser.name === "Edge");
    if (edge) {
      browserList.value = edge.name;
      browserList.dispatchEvent(new Event("change"));
    }
  } 
  
  else if (browsers.length > 0) {
    browserList.value = browsers[0].name;
    browserList.dispatchEvent(new Event("change"));
  } 
  
  else {
    browserList.remove();
    document.getElementById("browser-list-message").innerText =
      "No browsers found.";
  }
}
