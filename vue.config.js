module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "./src/preload.js",
      appId: 'com.sosolimited.mit-illuminations',
      builderOptions: {
        productName: "Illuminations by MIT",
        extraResources: ["./extraResources/**"],
        afterSign: "tools/notarize.js",
        mac: {
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist",
          writeUpdateInfo: false // disable blockmap generation to save time
        },
        dmg: {
          sign: false
        }
      },
      nodeIntegration: true,
      externals: ['serialport']
    },
  },
};
