"use strict";

const lazy = {};

XPCOMUtils.defineLazyServiceGetters(lazy, {
  gMIMEService: ["@mozilla.org/mime;1", "nsIMIMEService"],
});

const https = "https";
const iconSize = 32;
const browserNamesWin = ["Chrome", "Edge", "Opera", "Safari"];
const browserNamesMac = ["Safari", "Chrome", "Microsoft Edge", "Opera", "Arc"];
let logs = [];

this.experiments_firefox_launch = class extends ExtensionAPI {
  getAPI(context) {
    return {
      experiments: {
        firefox_launch: {
          _isValidHandlerExecutable(aExecutable) {
            let leafName;
            if (AppConstants.platform == "win") {
              leafName = `${AppConstants.MOZ_APP_NAME}.exe`;
            } else if (AppConstants.platform == "macosx") {
              leafName = AppConstants.MOZ_MACBUNDLE_NAME;
            } else {
              return false;
            }
            return (
              aExecutable &&
              aExecutable.exists() &&
              aExecutable.isExecutable() &&
              aExecutable.leafName !== leafName
            );
          },

          _isValidHandlerApp(aHandlerApp) {
            if (!aHandlerApp) {
              return false;
            }

            if (aHandlerApp instanceof Ci.nsILocalHandlerApp) {
              return this._isValidHandlerExecutable(aHandlerApp.executable);
            }
            return false;
          },

          // Get all windows able to open https protocol
          _getAvailableBrowsersWin() {
            let mimeInfo = lazy.gMIMEService.getFromTypeAndExtension(
              "text/html",
              "html"
            );
            let appList = mimeInfo.possibleLocalHandlers || [];
            let appDataList = [];
            for (let idx = 0; idx < appList.length; idx++) {
              let app = appList.queryElementAt(idx, Ci.nsILocalHandlerApp);
              logs.push("App: " + app.executable.path);
              if (!this._isValidHandlerApp(app)) {
                logs.push("Invalid app");
                continue;
              }
              let iconURI = Services.io.newFileURI(app.executable).spec;
              let iconString = "moz-icon://" + iconURI + "?size=" + iconSize;
              let appname =
                app.executable.parent.leafName !== "Application"
                  ? app.executable.parent.leafName
                  : app.executable.parent.parent.leafName;

              if (!browserNamesWin.includes(appname)) {
                continue;
              }

              let appData = {
                icon: iconString,
                name: appname,
                executable: app.executable.path,
              };
              appDataList.push(appData);
            }
            return appDataList;
          },

          _getAvailableBrowsersMac() {
            let shellService = Cc[
              "@mozilla.org/browser/shell-service;1"
            ].getService(Ci.nsIMacShellService);
            let appList = shellService.getAvailableApplicationsForProtocol(
              https
            );
            let appDataList = [];
            for (let app of appList) {
              if (!browserNamesMac.includes(app[0])) {
                continue;
              } else if (app[0] === "Microsoft Edge") {
                app[0] = "Edge";
              }
              let iconString = "moz-icon://" + app[1] + "?size=" + iconSize;
              let appData = {
                icon: iconString,
                name: app[0],
                executable: app[1],
              };
              appDataList.push(appData);
              logs.push("Icon: " + iconString);
              logs.push("Name: " + app[0]);
              logs.push("Executable: " + app[1]);
            }
            return appDataList;
          },

          async getAvailableBrowsers() {
            if (AppConstants.platform == "win") {
              return { browsers: this._getAvailableBrowsersWin(), logs: logs };
            } else if (AppConstants.platform == "macosx") {
              return { browsers: this._getAvailableBrowsersMac(), logs: logs };
            } else {
              logs.push("Unsupported platform: " + AppConstants.platform);
              return { browsers: null, logs: logs };
            }
          },

          getDefaultBrowser() {
            if (
              AppConstants.platform != "win" &&
              AppConstants.platform != "macosx"
            ) {
              return null;
            }
            let extProtocolSvc = Cc[
              "@mozilla.org/uriloader/external-protocol-service;1"
            ].getService(Ci.nsIExternalProtocolService);
            let handlerInfo = extProtocolSvc.getProtocolHandlerInfo(https);
            if (!handlerInfo.hasDefaultHandler) {
              logs.push("No default handler");
              return { name: null, logs: logs };
            }
            if (
              !browserNamesMac.includes(handlerInfo.defaultDescription) &&
              !browserNamesWin.includes(handlerInfo.defaultDescription)
            ) {
              logs.push("Default handler not supported");
              return { name: null, logs: logs };
            }
            return { name: handlerInfo.defaultDescription, logs: logs };
          },

          _launchAppWin(appExecutable, handlerArgs) {
            let file = Cc["@mozilla.org/file/local;1"].createInstance(
              Ci.nsIFile
            );
            let process = Cc["@mozilla.org/process/util;1"].createInstance(
              Ci.nsIProcess
            );
            file.initWithPath(appExecutable);
            process.init(file);
            process.run(false, handlerArgs, handlerArgs.length);
          },

          _launchAppMac(appExecutable, handlerArgs) {
            let opener = Cc["@mozilla.org/file/local;1"].createInstance(
              Ci.nsIFile
            );
            let process = Cc["@mozilla.org/process/util;1"].createInstance(
              Ci.nsIProcess
            );
            let uri = Services.io.newURI(appExecutable);
            let file = uri.QueryInterface(Ci.nsIFileURL).file;
            let argsToUse = ["-a", file.path, ...handlerArgs];
            opener.initWithPath("/usr/bin/open");
            process.init(opener);
            process.run(false, argsToUse, argsToUse.length);
          },

          launchApp(appExecutable, handlerArgs) {
            let file = null;
            if (AppConstants.platform == "win") {
              this._launchAppWin(appExecutable, handlerArgs);
            } else if (AppConstants.platform == "macosx") {
              this._launchAppMac(appExecutable, handlerArgs);
            } else {
              return;
            }
          },

          openPrivilegedUrl(url) {
            let win = Services.wm.getMostRecentWindow("navigator:browser");
            win.BrowserOpenAddonsMgr(url);
          }
        },
      },
    };
  }
};
