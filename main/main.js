const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
    // fullscreen: true,
  });

  const buildPath = path.join(
    __dirname,
    "..",
    "renderer",
    "dist",
    "index.html"
  );

  win.maximize();
  // win.loadFile(buildPath);
  win.loadURL("http://localhost:5173/");

  // const customeMenu = Menu.buildFromTemplate([]);
  // Menu.setApplicationMenu(customeMenu);
};

app.whenReady().then(() => {
  createWindow();
});

// ipcMain.handle("get-time", async () => {
//   return new Date().toLocaleString();
// });

ipcMain.handle("get-time", () => {
  const timestamp = new Date();
  const day = timestamp.toLocaleDateString();
  const time = [timestamp.getHours(), timestamp.getMinutes()];
  const date = timestamp.toLocaleString();

  return { day, time, date };
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
