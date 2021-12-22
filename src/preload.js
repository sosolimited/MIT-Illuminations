const dgram = require('dgram')
const electronStore = require('electron-store')
const fse = require('fs-extra')
const path = require('path')
const qs = require('querystring');

const kinetSocket = dgram.createSocket('udp4') // IPv4

// User data path. This is where we want electron-store to keep
// config.json, which holds all persistent settings for the app (e.g.
// kinet setup & show data). It is typically better to let electron-store
// figure out the default location, but we choose to specify
// here since electron-store is defined in the main process, but
// called in render. If we don't specify, config.json is kept in an
// unintuitive location. By setting the path manually, data will be kept in:
// Mac: ~/Library/Application%20Support/mit-illuminations/config.json
// Win: %APPDATA%/.local/share/mit-illuminations/config.json
// See https://issuehunt.io/r/sindresorhus/electron-store/issues/181.

// wes note: this is now being passed as a query string to the URL of this
// page (when loaded from the electron background process) -- this gets around
// the need to use IPC to look it up
const userDataPath = qs.decode(location.search.slice(1)).userDataPath;

/**
 * Create the Electron Store
 * @type {ElectronStore}
 */
const estore = new electronStore({
    cwd: userDataPath
});

window.dgram = {};
window.dgram.send = (buf, port, ip) => {
    kinetSocket.send(buf, port, ip);
};

window.estore = estore;

window.fse = {};
window.fse.copyAsset = (src, id) => {
    const ext = path.extname(src)
    const dest = path.join(userDataPath, 'user_uploads', `${id}${ext}`);

    fse.copy(src, dest, (err) => {
        if (err) return console.error(err)
    }).catch(console.log);
};
window['fse'].getBlog = (filePath) => {
    return fse.readFile(filePath)
}




