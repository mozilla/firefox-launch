import { initSharedListeners } from "Shared/backgroundScripts/listeners.js";

describe("shared/backgroundScripts/listeners.js", () => {
  describe("initSharedListeners()", () => {
    it("should add the listeners", () => {
      browser.tabs.query.mockResolvedValue([]);
      initSharedListeners();
      expect(browser.storage.session.get).toHaveBeenCalled();
      expect(browser.runtime.onInstalled.addListener).toHaveBeenCalled();
      expect(browser.contextMenus.onClicked.addListener).toHaveBeenCalled();
      expect(browser.commands.onCommand.addListener).toHaveBeenCalled();
      expect(browser.storage.sync.onChanged.addListener).toHaveBeenCalled();
    });
  });
});
