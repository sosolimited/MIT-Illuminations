'use strict'

// Handle any uncaught exceptions
import unhandled from "electron-unhandled";

unhandled();

import {app, BrowserWindow, Menu, protocol, dialog, ipcMain, shell} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {copyAssets, getAssetPath} from './assets'
import electronStore from "electron-store";
import pkgjson from '../package.json';

const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const userDataPath = app.getPath('userData');

// If any of the starter assets aren't in the userData path,
// copy them now in the background.
copyAssets();

// Fix for serial port usage
app.allowRendererProcessReuse = false;

// Fix for socket connection
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('--disable-renderer-backgrounding');

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    {
        scheme: 'app',
        privileges: {secure: true, standard: true, supportFetchAPI: true}
    },
    {
        scheme: 'asset',
        privileges: {supportFetchAPI: true}
    }
]);

function createWindow() {

    // Establish the splash screen
    const splash = new BrowserWindow({width: 800, height: 500, transparent: true, frame: false, alwaysOnTop: true});

    const template = [
        {
            label: 'Edit',
            submenu: [
                {
                    role: 'cut'
                },
                {
                    role: 'copy'
                },
                {
                    role: 'paste'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    role: 'togglefullscreen'
                },
                {
                    type: 'separator'
                },
                {
                    type: 'separator'
                },
                {
                    role: 'toggledevtools'
                },

            ]
        },
        {
            role: 'window',
            submenu: [
                {
                    role: 'minimize'
                },
                {
                    role: 'close'
                }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'About MIT Illuminations',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://illuminations.mit.edu')
                    }
                },
                {
                    label: 'Report a Bug',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://github.com/sosolimited/MIT-Illuminations/issues/new')
                    }
                },
                {
                    label: `version ${pkgjson.version}`,
                    enabled: false
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Create the browser window.
    const win = new BrowserWindow({
        show: false,
        width: 1600,
        height: 900,
        minWidth: 1000,
        fullscreen: false,
        minimizable: true,
        resizeable: true,
        //frame: false,
        title: 'Illuminations by MIT',
        icon: path.join(__dirname, 'build/icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            preload: path.join(__dirname, 'preload.js'),
            additionalArguments: [userDataPath],
            backgroundThrottling: false
        }
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        splash.loadURL(`file://${__dirname}/../public/splash.html`).catch(console.log);
        win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}`).catch(console.log);
    } else {
        createProtocol('app');
        splash.loadURL(`app://./splash.html`).catch(console.log);
        win.loadURL(`app://./index.html`).catch(error => {
            throw new Error(error.message);
        });
    }

    let crashResetPending = false;

    async function handleCrash() {
        if (crashResetPending) {
            return;
        }
        crashResetPending = true;
        let tempStore = new electronStore({
            cwd: userDataPath
        });
        let tempState = tempStore.get('state');
        tempState.errorFlag = true;
        tempState.errorTitle = tempState.playingNow.info.title;
        tempState.errorID = tempState.playingNow.id;
        tempStore.set('state', tempState);
        await dialog.showErrorBox('Illuminations by MIT is unresponsive', 'The Illuminations by MIT application is unresponsive. This may be due to an infinite loop or a small bug in the code of your show, "' + tempState.playingNow.info.title + '" if you were editing code at the time. The application will restart, and the problematic show will be temporarily disabled.');
        win.webContents.forcefullyCrashRenderer();
        win.reload();
        crashResetPending = false;
    }

    win.on('show', () => {
        setTimeout(() => {
            win.focus();
        }, 200);

        // Receive messages from the renderer, and assume we crashed if we don't get some for a while
        let killIPCTimeout;
        ipcMain.on('ping', () => {
            clearTimeout(killIPCTimeout);
            killIPCTimeout = setTimeout(handleCrash, 3000);
        });

    });

    win.once('ready-to-show', () => {
        splash.destroy();
        win.show();
    });

    // Disable the currently playing show on application crash/hang
    win.webContents.on('unresponsive', handleCrash);
    win.webContents.on('render-process-gone', async (e, details) => {
        if (details.reason === 'crashed' || details.reason === 'abnormal-exit' || details.reason === 'oom') {
            await handleCrash();
        }
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    protocol.registerFileProtocol('asset', (request, callback) => {
        const pathname = decodeURI(request.url.replace('asset://', ''))
        try {
            const fullpath = getAssetPath(pathname);
            callback(fullpath);
        } catch (err) {
            console.error(err);
            callback(404);
        }
    });

    createWindow();
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
