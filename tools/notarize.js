// adapted from https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/

const path = require('path');

require('dotenv').config({
  path: path.join(__dirname, '../.env.local')
});

const { notarize } = require('electron-notarize');
const vueOpts = require('../vue.config.js');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    tool: 'notarytool',
    appBundleId: vueOpts.pluginOptions.electronBuilder.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
    teamId: process.env.APPLETEAMID
  });
};