import { expect } from "chai";
import { describe, it } from "mocha";

import { launchBrowser } from "../../../build/firefox/interfaces/launchBrowser.js";
import { setIsCurrentTabValidUrlScheme } from "../../../build/firefox/shared/backgroundScripts/validTab.js";
import { setStorage } from "../../setup.test.js";

describe("firefox/interfaces/launchBrowser.js", () => {
  describe("launchBrowser()", () => {
    it("should return false if the url scheme is not valid", async () => {
      setIsCurrentTabValidUrlScheme(false);
      const result = await launchBrowser({ url: "https://example.com" });
      expect(result).to.equal(false);
    });

    it("should return false and open the welcome page if there is no launch protocol", async () => {
      setIsCurrentTabValidUrlScheme(true);
      const result = await launchBrowser({ url: "https://example.com" });
      expect(result).to.equal(false);
      expect(browser.tabs.create.callCount).to.equal(1);
      expect(
        browser.tabs.create.calledWith({
          url: browser.runtime.getURL("shared/pages/welcomePage/index.html"),
        })
      ).to.be.true;
    });

    it("should return true if there is a launch protocol", async () => {
      setIsCurrentTabValidUrlScheme(true);
      setStorage("currentExternalBrowserLaunchProtocol", "test");
      const result = await launchBrowser({ url: "https://example.com" });
      expect(result).to.equal(true);
      expect(browser.experiments.firefox_launch.launchApp.callCount).to.equal(
        1
      );
      expect(
        browser.experiments.firefox_launch.launchApp.calledWith("test", [
          "https://example.com",
        ])
      ).to.be.true;
    });
  });
});
