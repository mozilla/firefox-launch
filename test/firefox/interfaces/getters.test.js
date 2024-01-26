import { expect } from "chai";
import { describe, it } from "mocha";

import {
  getDefaultIconPath,
  getGreyedIconPath,
  getExternalBrowserLaunchProtocol
} from "../../../build/firefox/interfaces/getters.js";
import { setStorage } from "../../setup.test.js";


describe("firefox/interfaces/getters.js", () => {

  describe("getDefaultIconPath()", () => {
    it("should return the current browser icon path", async () => {
      setStorage("currentExternalBrowser", "chrome");
      const result = await getDefaultIconPath();
      expect(result).to.deep.equal({
        32: browser.runtime.getURL("images/chrome/32.png"),
      });
    });

    it("should return the firefox icon if no current browser", async () => {
      setStorage("currentExternalBrowser", undefined);
      const result = await getDefaultIconPath();
      expect(result).to.deep.equal({
        32: browser.runtime.getURL("images/firefox-launch/32.png"),
      });
    });
  });

  describe("getGreyedIconPath()", () => {
    it("should return the greyed current browser icon path", async () => {
      setStorage("currentExternalBrowser", "chrome");
      const result = await getGreyedIconPath();
      expect(result).to.deep.equal({
        32: browser.runtime.getURL("images/chrome/32grey.png"),
      });
    });

    it("should return firefox icon if no current browser", async () => {
      setStorage("currentExternalBrowser", undefined);
      const result = await getGreyedIconPath();
      expect(result).to.deep.equal({
        32: browser.runtime.getURL("images/firefox-launch/32.png"),
      });
    });
  });

  describe("getExternalBrowserLaunchProtocol()", () => {
    it("should return the current external browser launch protocol", async () => {
      setStorage("currentExternalBrowserLaunchProtocol", "test");
      const result = await getExternalBrowserLaunchProtocol();
      expect(result).to.equal("test");
    });

    it("should return an empty string if no current external browser launch protocol", async () => {
      setStorage("currentExternalBrowserLaunchProtocol", undefined);
      const result = await getExternalBrowserLaunchProtocol();
      expect(result).to.equal("");
    });
  });
});
