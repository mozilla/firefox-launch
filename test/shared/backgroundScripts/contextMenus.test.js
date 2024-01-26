import { expect } from "chai";
import { describe, it } from "mocha";

import { initContextMenu } from "../../../build/chromium/shared/backgroundScripts/contextMenus.js";

import { setStorage, getLocaleMessage, setExtensionIsChromium } from "../../setup.test.js";

describe("shared/backgroundScripts/contextMenus.js", () => {
  describe("initContextMenu()", () => {
    it("should make the shared context menu", async () => {
      setStorage("currentExternalBrowser", "Firefox");
      setExtensionIsChromium(true);
      await initContextMenu();
      expect(
        browser.contextMenus.create.calledWith({
          id: "launchInExternalBrowser",
          title: getLocaleMessage("launchInExternalBrowser"),
          contexts: ["page"],
        })
      ).to.be.true;
      expect(
        browser.contextMenus.create.calledWith({
          id: "launchInExternalBrowserLink",
          title: getLocaleMessage("launchInExternalBrowserLink"),
          contexts: ["link"],
        })
      ).to.be.true;
      expect(
        browser.contextMenus.create.calledWith({
          id: "openWelcomePage",
          title: getLocaleMessage("openWelcomePage"),
          contexts: ["action"],
        })
      ).to.be.true;
    });
  });
});
