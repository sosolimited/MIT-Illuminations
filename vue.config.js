module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: "./src/preload.js",
      builderOptions: {
        productName: "Illuminations by MIT - Turn P5 Code into Light Shows",
        extraResources: ["./extraResources/**"],
        npmRebuild: false
      },
      nodeIntegration: true,
      externals: ['serialport']
    },
  },
};
