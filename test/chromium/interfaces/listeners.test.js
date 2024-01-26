import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";

import { initPlatformListeners } from "../../../build/chromium/interfaces/listeners.js";

import { setStorage } from "../../setup.test.js";

describe("chromium/interfaces/listeners.js", () => {
  beforeEach(() => {
    setStorage("currentExternalBrowser", "Firefox");
  });
  describe("initPlatformListeners()", () => {
    it("should add the listeners", () => {
      initPlatformListeners();
      expect(browser.runtime.onInstalled.addListener.callCount).to.equal(1);
      expect(browser.action.onClicked.addListener.callCount).to.equal(1);
    });
  });
});
