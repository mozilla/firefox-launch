import { expect } from "chai";
import { describe, it } from "mocha";

import { initTelemetryListeners } from "../../../build/chromium/shared/backgroundScripts/telemetry.js";

describe("shared/backgroundScripts/telemetry.js", () => {
  describe("initTelemetryListeners()", () => {
    it("should add the listeners", () => {
      initTelemetryListeners();
      expect(chrome.runtime.onInstalled.addListener.callCount).to.equal(1);
      expect(chrome.runtime.onStartup.addListener.callCount).to.equal(1);
      expect(chrome.storage.local.onChanged.addListener.callCount).to.equal(1);
    });
  });
});