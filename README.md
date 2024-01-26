# Firefox Launch

A Chromium and Firefox extension that allows the user to open Firefox from Chromium quickly as well as open other browsers from Firefox.

## Requirements

- Firefox Nightly or Beta 109+
- Some Chromium browser 88+ 

## Development

Run `npm i` to install dependencies.

Run `npm run build` to build the extension.

To see changes made to the extension, first build the extension, then reload the extension in the browser.

### Run in Chromium

1. Open your chromium browser
2. Go to the extensions page (e.g. `chrome://extensions`)
3. Enable developer mode
4. Click on "Load unpacked" and select the `build/chromium` folder or the `dist/chromium.zip` file.

To see console logs, inspect the service worker.

### Run in Firefox

Since Firefox Launch for Firefox uses experimental APIs, you will need to use Firefox Nightly or Beta, then:

1. Open your Firefox browser
2. Go to about:config
3. Set `xpinstall.signatures.required` to `false`
4. Set `extensions.experiments.enabled` to `true`

To load the extension:

1. Go to `about:debugging#/runtime/this-firefox`
2. Click on "Load Temporary Add-on..."
3. Select the `build/firefox/manifest.json` file or the `dist/firefox.zip` file.
4. Click `Inspect` to see the console logs.

### Tests

Run `npm test` to run the tests.

The tests use the files in the `build` folder. Since the shared logic is the same for both browsers, the shared tests are imported from the `build/chromium` folder only.

### Building

Since the Firefox and Chromium extension has a lot of shared logic, but also independent logic, the build process is a bit complicated. 

- The `src` folder contains the `shared`, `_locales`, `firefox`, and `chromium` folders. 
- The `chromium` and `firefox` folders contain an `interfaces` folder that contains the interfaces for the shared logic.
- The import statements within the `shared` folder will always point to the code in the `chromium/interfaces` folder. This is to simplify development within the IDE.
- During the build process in `build.js`, the `interfaces` imports will point to the correct folder depending on the browser.
- Webpack is used for Glean telemetry, so `build/<browser>/background.bundle.js` is the entry point for the background script. The files not required anymore are removed in the `dist` zipped extension. Otherwise, they are used for testing in the `build` folder.

### Experimental APIs

In Firefox, we use experimental APIs to fetch which browsers are installed on the users computer as well as launch the browser without relying on the protocol handler. To learn more about the APIs, see the [Experiments Documentation](https://webextension-api.thunderbird.net/en/latest/how-to/experiments.html).

Due to the privileged-ness of the Firefox extension, we must use manifest V2, hence the lack of callbacks and `browser.browserAction` vs `browser.action`.
