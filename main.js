const { app, BrowserWindow } = require("electron");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    win.loadFile("dist/angular-electron/index.html").then(
        () => { },
        (reason) => {
            console.log(`Could not start app because ${reason}`);
        }
    );
};

// when all windows of the app are closed, quit the app
app.on("window-all-closed", () => app.quit());

// if no windows are open and the app is activated, open a new window
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// launch the app
app.whenReady().then(() => createWindow());
