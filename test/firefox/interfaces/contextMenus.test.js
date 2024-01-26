import { expect } from "chai";
import { describe, it, beforeEach } from "mocha";

import {
  applyPlatformContextMenus,
  handlePlatformContextMenuClick,
} from "../../../build/firefox/interfaces/contextMenus.js";

import { setStorage } from "../../setup.test.js";

describe("firefox/interfaces/contextMenus.js", () => {
  beforeEach(() => {
    setStorage("currentExternalBrowser", "Firefox");
  });
  describe("applyPlatformContextMenus()", () => {
  });

  describe("handlePlatformContextMenuClick()", () => {
    it("should open the welcome page", async () => {
      await handlePlatformContextMenuClick({
        menuItemId: "openWelcomePage",
      });
      expect(browser.tabs.create.callCount).to.equal(1);
      expect(
        browser.runtime.getURL.calledWith("shared/pages/welcomePage/index.html")
      ).to.be.true;
    });
  });
});
