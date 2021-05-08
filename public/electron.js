const electron = require("electron");
const { app } = electron;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const ipcMain = electron.ipcMain;
const { screen } = electron;

let mainWindow;

// ____ CRAETE MAIN WINDOW ____
function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().size;

    const widthPercentage = 0.7;
    const heightPercentage = 0.75;
    mainWindow = new BrowserWindow({
        // show: false,
        width: width * widthPercentage,
        height: height * heightPercentage,
        minWidth: 500,
        minHeight: 650,
        icon: "build/list.png",
        webPreferences: {
            devTools: false,
            nodeIntegration: true,
        },
        frame: false,
        titleBarStyle: 'hidden'

    });

    mainWindow.loadURL(
        isDev ?
        "http://localhost:3000" :
        `file://${path.join(__dirname, "../build/index.html")}`
    );
    // ____ Remove Mnue Bar ____
    mainWindow.setMenu(null);

    mainWindow.on("closed", () => (mainWindow = null));

    // mainWindow.maximize();

    // mainWindow.webContents.openDevTools();
}

// ____ ______ ________ ______ ________ ______ ________ ______ ____
app.on("ready", () => {
    createWindow();
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// _____ SIA ______
if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on("second-instance", (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

// Title Bar Event

ipcMain.handle("minimize-event", () => {
    mainWindow.minimize();
});

ipcMain.handle("unmaximize-event", () => {
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});

ipcMain.handle("close-event", () => {
    app.quit();
});