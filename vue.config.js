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
          entitlementsInherit: "build/entitlements.mac.plist"
        },
        dmg: {
          sign: false, // signing DMGs without notarizing can cause errors
          writeUpdateInfo: false // disable blockmap generation to save time
        }
      },
      nodeIntegration: true,
      externals: ['serialport']
    },
  },
};
