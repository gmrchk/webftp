const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const globalShortcut = electron.globalShortcut
// env
const appEnv = require('./env.json');

const isProd = appEnv.env === "production";

const path = require('path')
const url = require('url')

const express = require("express");
const server = express();

server.use('/', express.static(path.join(__dirname, './')));

server.listen(5555, () => console.log(`Server running`));


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// load last settings
var JSONStorage = require('node-localstorage').JSONStorage;
var storageLocation = app.getPath('userData');
global.nodeStorage = new JSONStorage(storageLocation);

var windowState = {};
try {
    windowState = global.nodeStorage.getItem('windowstate');
} catch (err) {
    // the file is there, but corrupt. Handle appropriately.
    windowState = {};
}

function createWindow () {
    if(!windowState) {
        windowState = {};
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        transparent: false,
        frame: true,
        show: false,
        x: windowState && windowState.bounds && windowState.bounds.x || undefined,
        y: windowState && windowState.bounds && windowState.bounds.y || undefined,
        width: windowState && windowState.bounds && windowState.bounds.width || 1200,
        height: windowState && windowState.bounds && windowState.bounds.height || 700,
    });

    // Restore maximised state if it is set.
    // not possible via options so we do it here
    if (windowState && windowState.isMaximized) {
        mainWindow.maximize();
    }

    // and load the index.html of the app.
    const startUrl = !isProd ? "http://localhost:3000" : "http://localhost:5555";
    mainWindow.loadURL(startUrl);

    // Open the DevTools.
    if(!isProd) {
        // mainWindow.webContents.openDevTools();
    }

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

app.on('ready', () => {
    globalShortcut.register('CommandOrControl+K', () => {
        mainWindow.webContents.executeJavaScript("document.getElementById('searchbar').focus()")
    })

    mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.show();
        mainWindow.focus();
    });


    // save window state on change
    ['resize', 'move', 'close' ].forEach(function(event) {
        mainWindow.on(event, function() {
            storeWindowState();
        });
    });

    var storeWindowState = function() {
        windowState.isMaximized = mainWindow.isMaximized();
        if (!windowState.isMaximized) {
            // only update bounds if the window isn’t currently maximized
            windowState.bounds = mainWindow.getBounds();
        }

        global.nodeStorage.setItem('windowstate', windowState);
    };
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
    app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
    createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
