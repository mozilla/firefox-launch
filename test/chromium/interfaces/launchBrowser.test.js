import { expect } from "chai";
import { describe, it } from "mocha";

import { launchBrowser } from "../../../build/chromium/interfaces/launchBrowser.js";

import { setStorage } from "../../setup.test.js";
import { setIsCurrentTabValidUrlScheme } from "../../../build/chromium/shared/backgroundScripts/validTab.js";

describe("chromium/interfaces/launchBrowser.js", () => {
  describe("launchBrowser()", () => {
    it("should direct the user to the Firefox download page if Firefox is not installed", async () => {
      setStorage("isFirefoxInstalled", false);
      const result = await launchBrowser();
      expect(result).to.be.false;
      expect(browser.tabs.create.callCount).to.equal(1);
      expect(
        browser.tabs.create.calledWith({
          url: "https://www.mozilla.org/firefox/",
        })
      ).to.be.true;
    });

    it("should launch the current tab in Firefox", async () => {
      setStorage("isFirefoxInstalled", true);
      setIsCurrentTabValidUrlScheme(true);
      const result = await launchBrowser(
        { id: 1, url: "https://mozilla.org" },
        true
      );
      expect(result).to.be.true;
      expect(browser.tabs.update.callCount).to.equal(1);
      expect(
        browser.tabs.update.calledWith(1, { url: "firefox:https://mozilla.org" })
      ).to.be.true;
    });

    it("should launch the current tab in Firefox Private Browsing", async () => {
      setStorage("isFirefoxInstalled", true);
      setIsCurrentTabValidUrlScheme(true);
      const result = await launchBrowser(
        { id: 1, url: "https://mozilla.org" },
        false
      );
      expect(result).to.be.true;
      expect(browser.tabs.update.callCount).to.equal(1);
      expect(
        browser.tabs.update.calledWith(1, {
          url: "firefox-private:https://mozilla.org",
        })
      ).to.be.true;
    });

    it("should not launch the current tab if the url scheme is not valid", async () => {
      setStorage("isFirefoxInstalled", true);
      setIsCurrentTabValidUrlScheme(false);
      const result = await launchBrowser(
        { id: 1, url: "https://mozilla.org" },
        true
      );
      expect(result).to.be.false;
      expect(browser.tabs.update.callCount).to.equal(0);
    });
  });
});
