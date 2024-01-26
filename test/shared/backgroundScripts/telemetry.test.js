import { expect } from "chai";
import { describe, it } from "mocha";

import { initTelemetryListeners } from "../../../build/chromium/shared/backgroundScripts/telemetry.js";

describe("shared/backgroundScripts/telemetry.js", () => {
  describe("initTelemetryListeners()", () => {
    it("should add the listeners", () => {
      initTelemetryListeners();
      expect(browser.runtime.onInstalled.addListener.callCount).to.equal(1);
      expect(browser.runtime.onStartup.addListener.callCount).to.equal(1);
      expect(browser.storage.onChanged.addListener.callCount).to.equal(1);
    });
  });
});