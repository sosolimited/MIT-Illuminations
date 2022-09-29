const dgram = require('dgram')
const electronStore = require('electron-store')
const fse = require('fs-extra')
const path = require('path')

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

const userDataPath = window.process.argv.slice(-1)[0];

/**
 * Create the Electron Store
 * @type {ElectronStore}
 */
const estore = new electronStore({
    cwd: userDataPath
});

window.dgram = {};
window.dgram.send = (buf, port, ip) => {
    kinetSocket.send(buf, port, ip, function (error) {
        if (error) {
            console.log(error);
        }
    });
};

window.estore = estore;

window.fse = {};
window.fse.copyAsset = async (src, id) => {
    const ext = path.extname(src);
    console.log(userDataPath, id, ext, src);
    const dest = path.join(userDataPath, 'user_uploads', `${id}${ext}`);
    try {
        await fse.copy(src, dest, (err) => {
            if (err) return console.error(err)
        });
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};




