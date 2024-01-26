import sinon from "sinon";
import { beforeEach, afterEach } from "mocha";
import { testResetGlean } from "@mozilla/glean/testing";

import { isCurrentTabValidUrlScheme } from "../src/shared/backgroundScripts/validTab.js";

/* global global */

// Mock the chrome and browser API for each of the fields we use.
global.chrome = {
  testEnv: true,
  contextMenus: {
    create: sinon.stub(),
    update: sinon.stub(),
    onClicked: {
      addListener: sinon.stub(),
    },
  },
  storage: {
    sync: {
      get: sinon.stub(),
      onChanged: {
        addListener: sinon.stub(),
      },
      set: sinon.stub(),
    },
    local: {
      get: sinon.stub(),
      set: sinon.stub(),
      onChanged: {
        addListener: sinon.stub(),
      },
    },
    onChanged: {
      addListener: sinon.stub(),
    },
  },
  runtime: {
    id: "test",
    onInstalled: {
      addListener: sinon.stub(),
    },
    getURL: sinon.stub(),
    onStartup: {
      addListener: sinon.stub(),
    },
    getManifest: sinon.stub(),
  },
  action: {
    setIcon: sinon.stub(),
    onClicked: {
      addListener: sinon.stub(),
    },
  },
  browserAction: {
    setIcon: sinon.stub(),
    onClicked: {
      addListener: sinon.stub(),
    },
  },
  tabs: {
    onUpdated: {
      addListener: sinon.stub(),
    },
    onActivated: {
      addListener: sinon.stub(),
    },
    onCreated: {
      addListener: sinon.stub(),
    },
    update: sinon.stub(),
    create: sinon.stub(),
    query: sinon.stub(),
  },
  commands: {
    onCommand: {
      addListener: sinon.stub(),
    },
  },
  i18n: {
    getMessage: sinon.stub(),
  },
  webRequest: {
    onBeforeRequest: {
      addListener: sinon.stub(),
    },
  },
  declarativeNetRequest: {
    updateDynamicRules: sinon.stub(),
    getDynamicRules: sinon.stub(),
  },
};

global.document = {
  addEventListener: sinon.stub(),
};

global.browser = global.chrome;
global.browser.experiments = {
  firefox_launch: {
    getAvailableBrowsers: sinon.stub(),
    getDefaultBrowser: sinon.stub(),
    launchApp: sinon.stub(),
  },
};

const locales = await import("../src/_locales/en/messages.json", {
  assert: { type: "json" },
});

export const setSyncStorage = (key, keyValue) => {
  global.browser.storage.sync.get.callsFake((_) => {
    return { [key]: keyValue };
  });
};

export const setLocalStorage = (key, keyValue) => {
  global.browser.storage.local.get.callsFake((_) => {
    return { [key]: keyValue };
  });
};

export const setStorage = (key, keyValue, storageLocation) => {
  if (storageLocation === "sync") {
    setSyncStorage(key, keyValue);
  } else if (storageLocation === "local") {
    setLocalStorage(key, keyValue);
  } else {
    setSyncStorage(key, keyValue);
    setLocalStorage(key, keyValue);
  }
};

export const setExtensionIsChromium = (isChromium) => {
  global.browser.runtime.getManifest.callsFake(() => {
    if (isChromium) {
      return { minimum_chrome_version: 3 };
    } else {
      return {};
    }
  });
};

export const setCurrentTabURL = (currentTabURL) => {
  global.browser.tabs.query.callsFake((queryInfo) => {
    return [
      {
        url: currentTabURL,
      },
    ];
  });
};

export const getIsCurrentTabValidUrlScheme = () => {
  return isCurrentTabValidUrlScheme;
};

export const getLocaleMessage = (key) => {
  return locales.default[key].message;
};

// Reset all stubs within our chrome and browser API.
function resetStubs(obj) {
  for (const prop in obj) {
    if (typeof obj[prop] === "object") {
      resetStubs(obj[prop]);
    } else if (obj[prop].reset) {
      obj[prop].reset();
    }
  }
}

beforeEach(async () => {
  await testResetGlean("firefox-launch");
  setStorage("isFirefoxInstalled", true);
  global.browser.i18n.getMessage.callsFake((key) => {
    return getLocaleMessage(key);
  });
});

afterEach(() => {
  resetStubs(global.chrome);
  resetStubs(global.document);
});
