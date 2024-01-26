import { initSharedListeners } from "./listeners.js";
import { initPlatformListeners } from "../../chromium/interfaces/listeners.js";
import { initTelemetryListeners } from "./telemetry.js";

initPlatformListeners();
initSharedListeners();
initTelemetryListeners();
