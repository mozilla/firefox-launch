import { expect } from "chai";
import { describe, it } from "mocha";

import { initPlatformListeners } from "../../../build/firefox/interfaces/listeners.js";

describe("firefox/interfaces/listeners.js", () => {
  describe("initPlatformListeners()", () => {
    it("should add the listeners", () => {
      initPlatformListeners();
      expect(browser.browserAction.onClicked.addListener.callCount).to.equal(1);
    });
  });
});
