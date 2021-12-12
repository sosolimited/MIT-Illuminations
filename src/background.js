'use strict'

import {app, protocol, BrowserWindow, Menu} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {copyAssets} from './assets'

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const shell = require('electron').shell;
const userDataPath = app.getPath('userData');

const unhandled = require('electron-unhandled');
unhandled();

// If any of the starter assets aren't in the userData path,
// copy them now in the background.
copyAssets();

// Fix for serialport usage
app.allowRendererProcessReuse = false;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: {secure: true, standard: true, supportFetchAPI: true}
    }
]);

async function createWindow() {
    // Define the application file menu
    const fileMenu = Menu.buildFromTemplate([
        /*{
            label: 'File',
            submenu: [
                {
                    label: 'New Show'
                },
                {
                    type:'separator'
                },
                {
                    label: 'Exit',
                    click() {
                        app.quit()
                    }
                }
            ]
        },*/
        {
            label: 'Support',
            submenu: [
                {
                    label: 'About Illuminations',
                    click() {
                        shell.openExternal('https://illuminations.mit.edu/')
                    }
                },
                {
                    label: 'Bug Report / Feature Request',
                    click() {
                        shell.openExternal('https://github.com/sosolimited/MIT-Illuminations/issues')
                    }
                },
            ]
        }
    ]);
    Menu.setApplicationMenu(fileMenu);

    // Create the browser window.
    const win = new BrowserWindow({
        show: false,
        width: 1600,
        height: 900,
        minWidth: 1000,
        fullscreen: false,
        minimizable: true,
        resizeable: true,
        title: 'Illuminations by MIT - Turn P5 Code into Light Shows',
        icon: path.join(__dirname, 'build/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode,
        // and pass the user data path because it's harder to look up in render process
        await win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}?userDataPath=${encodeURIComponent(userDataPath)}`).then(() => {
            win.show();
            win.openDevTools();
        }).catch(console.log);
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        await win.loadURL(`app://./index.html?userDataPath=${encodeURIComponent(userDataPath)}`).then(() => {
            win.show();
        }).catch(console.log);
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURI(request.url.replace('file://', ''))
        try {
            return callback(pathname)
        } catch (err) {
            console.error(err)
            return callback(404)
        }
    })

    await createWindow();
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        })
    }
}
