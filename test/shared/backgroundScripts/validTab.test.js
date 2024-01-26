import { expect } from "chai";
import { describe, it } from "mocha";

import {
  checkAndUpdateURLScheme,
  isCurrentTabValidUrlScheme,
  setIsCurrentTabValidUrlScheme,
} from "../../../build/chromium/shared/backgroundScripts/validTab.js";

describe("shared/backgroundScripts/validTab.js", () => {
  describe("checkAndUpdateURLScheme()", () => {
    it("should return true if the scheme is http or https", () => {
      setIsCurrentTabValidUrlScheme(false);
      checkAndUpdateURLScheme({
        url: "http://www.google.com",
      });
      expect(isCurrentTabValidUrlScheme).to.be.true;

      setIsCurrentTabValidUrlScheme(false);
      checkAndUpdateURLScheme({
        url: "https://www.google.com",
      });
      expect(isCurrentTabValidUrlScheme).to.be.true;

      setIsCurrentTabValidUrlScheme(false);
      checkAndUpdateURLScheme({
        url: "file://path/to/file",
      });
      expect(isCurrentTabValidUrlScheme).to.be.true;
    });

    it("should return false if the scheme is not http or https", () => {
      setIsCurrentTabValidUrlScheme(true);
      checkAndUpdateURLScheme({
        url: "chrome://extensions/",
      });
      expect(isCurrentTabValidUrlScheme).to.be.false;

      setIsCurrentTabValidUrlScheme(true);
      checkAndUpdateURLScheme({
        url: "about:blank",
      });
      expect(isCurrentTabValidUrlScheme).to.be.false;
    });
  });

  describe("setIsCurrentTabValidUrlScheme()", () => {
    it("should set the value of isCurrentTabValidUrlScheme", () => {
      setIsCurrentTabValidUrlScheme(true);
      expect(isCurrentTabValidUrlScheme).to.be.true;

      setIsCurrentTabValidUrlScheme(false);
      expect(isCurrentTabValidUrlScheme).to.be.false;
    });
  });
});
