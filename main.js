const { app, BrowserWindow, ipcMain } = require("electron");
const os = require("os");
const pty = require("node-pty");

const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
    });

    win.loadFile("dist/angular-electron/index.html").then(
        () => { },
        (reason) => {
            console.log(`Could not start app because ${reason}`);
        }
    );

    const ptyProcess = pty.spawn(shell, [], {
        name: "xterm-color",
        cols: 80,
        rows: 30,
        cwd: process.env.HOME,
        env: process.env,
    });

    // when actual terminal emits data, send the data to xterm terminal
    ptyProcess.onData("data", function (data) {
        win.webContents.send(data);
    });

    // when user writes on the xterm terminal, send the data to actual terminal
    ipcMain.on("terminal.keystroke", (event, key) => {
        ptyProcess.write(key);
    });
};

// when all windows of the app are closed, quit the app
app.on("window-all-closed", () => app.quit());

// if no windows are open and the app is activated, open a new window
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// launch the app
app.whenReady().then(() => createWindow());
