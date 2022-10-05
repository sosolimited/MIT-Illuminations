module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "./src/preload.js",
      appId: 'com.sosolimited.mit-illuminations',
      builderOptions: {
        productName: "Illuminations by MIT",
        extraResources: ["./extraResources/**"],
      },
      nodeIntegration: true,
      externals: ['serialport']
    },
  },
};
