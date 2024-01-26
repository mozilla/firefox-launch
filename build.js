import fs from "fs";
import path from "path";

function replaceInterfaceImportsInFiles(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  const result = file.replace(
    /\.\.\/\.\.\/chromium\/interfaces/g,
    "../../interfaces"
  );
  fs.writeFileSync(filePath, result, "utf8");
}

function replaceInterfaceImportsInFolders(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceInterfaceImportsInFolders(filePath);
    } else {
      replaceInterfaceImportsInFiles(filePath);
    }
  });
}

function replaceSharedImportsInFolders(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      replaceSharedImportsInFolders(filePath);
    } else {
      replaceSharedImportsInFiles(filePath);
    }
  });
}

function replaceSharedImportsInFiles(filePath) {
  const file = fs.readFileSync(filePath, "utf8");
  const result = file.replace(/(\.\.\/)(.*)shared/g, "./$2shared");
  fs.writeFileSync(filePath, result, "utf8");
}

// copies everything from source folder to target folder
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  if (fs.lstatSync(source).isDirectory()) {
    fs.readdirSync(source).forEach((file) => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        const curTarget = path.join(target, file);
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        const curTarget = path.join(target, file);
        // if its an image, copy it as a buffer
        if (file.endsWith(".png") || file.endsWith(".jpg")) {
          const read = fs.createReadStream(curSource);
          const write = fs.createWriteStream(curTarget);
          read.pipe(write);
        } else {
          fs.copyFileSync(curSource, curTarget);
        }
      }
    });
  }
}

// simply deletes and remakes the ./build folder
function makeBuildFolder() {
  console.log("Creating build folder...\n");
  const __dirname = path.resolve();
  const buildFolder = path.join(__dirname, "build");
  if (!fs.existsSync(buildFolder)) {
    fs.mkdirSync(buildFolder);
  } else {
    fs.rmSync(buildFolder, { recursive: true });
    fs.mkdirSync(buildFolder);
  }
}

function buildExtension(extensionPlatform) {
  // make/clear the build folder
  const __dirname = path.resolve();
  const buildFolder = path.join(__dirname, "build", extensionPlatform);

  // copy everything from ./src/{platform} to ./build/{platform}
  console.log(`Copying ${extensionPlatform} files...`);
  const srcFolder = path.join(__dirname, "src", extensionPlatform);
  copyFolderRecursiveSync(srcFolder, buildFolder);

  // replace all shared import paths for all files and subfolders in ./build/{platform}
  console.log("Replacing shared import paths...");
  replaceSharedImportsInFolders(buildFolder);

  // copy the shared folder to ./build/{platform}/shared
  console.log("Copying shared files...");
  const sharedFolder = path.join(__dirname, "src", "shared");
  const sharedBuildFolder = path.join(buildFolder, "shared");
  copyFolderRecursiveSync(sharedFolder, sharedBuildFolder);

  // replace all ../../chromium/interfaces with ../../interfaces
  console.log("Replacing interface import paths...");
  replaceInterfaceImportsInFolders(sharedBuildFolder);

  // copy the locales folder to build/{platform}/_locales
  console.log("Copying locales files...");
  const localesFolder = path.join(__dirname, "src", "_locales");
  const localesBuildFolder = path.join(buildFolder, "_locales");
  copyFolderRecursiveSync(localesFolder, localesBuildFolder);

  // copy browser-polyfill.min.js from node_modules/webextensions-polyfill/dist to the build folder
  // (when done with webpack, errors occur)
  console.log("Copying browser polyfill...");
  const polyfillFile = path.join(
    __dirname,
    "node_modules",
    "webextension-polyfill",
    "dist",
    "browser-polyfill.min.js"
  );
  const polyfillBuildFile = path.join(buildFolder, "browser-polyfill.js");
  fs.copyFileSync(polyfillFile, polyfillBuildFile);
  

  console.log(
    `\n${extensionPlatform} build complete! Reload the extension in your browser to see changes.\n`
  );
}

function buildExtensions() {
  makeBuildFolder();
  buildExtension("firefox");
  buildExtension("chromium");
  console.log("Zipping extensions...\n");
}

buildExtensions();
