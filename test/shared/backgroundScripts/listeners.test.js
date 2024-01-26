import { expect } from "chai";
import { describe, it } from "mocha";

import { initSharedListeners } from "../../../build/chromium/shared/backgroundScripts/listeners.js";

describe("shared/backgroundScripts/listeners.js", () => {
  describe("initSharedListeners()", () => {
    it("should add the listeners", () => {
      initSharedListeners();
      expect(browser.runtime.onInstalled.addListener.callCount).to.equal(1);
      expect(browser.contextMenus.onClicked.addListener.callCount).to.equal(1);
      expect(browser.commands.onCommand.addListener.callCount).to.equal(1);
      expect(browser.tabs.onUpdated.addListener.callCount).to.equal(1);
      expect(browser.tabs.onCreated.addListener.callCount).to.equal(1);
      expect(browser.tabs.onActivated.addListener.callCount).to.equal(1);
      expect(browser.storage.sync.onChanged.addListener.callCount).to.equal(1);
    });
  });
});
