module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "./src/preload.js",
      appId: 'com.sosolimited.mit-illuminations',
      extendInfo: {
        NSMicrophoneUsageDescription: "Some shows require microphone input.",
      },
      builderOptions: {
        productName: "Illuminations by MIT",
        extraResources: ["./extraResources/**", "./LICENSE"],
        afterSign: "tools/notarize.js",
        /*win: {
          target: ['zip']
        },*/
        mac: {
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: "build/entitlements.mac.plist",
          entitlementsInherit: "build/entitlements.mac.plist",
          target: ['dmg']
        },
        dmg: {
          sign: false, // signing DMGs without notarizing can cause errors
          writeUpdateInfo: false // disable blockmap generation to save time
        },
        linux: {
          target: ['AppImage'],
          category: 'Development',
        },
      },
      nodeIntegration: true,
      externals: ['serialport']
    },
  },
};
