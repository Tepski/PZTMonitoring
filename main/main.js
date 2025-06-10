const { app, BrowserWindow, ipcMain, Menu, dialog } = require("electron");
const path = require("path");
const ExcelJS = require("exceljs");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    icon: path.join(__dirname, "../renderer/src/assets/npi.ico"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
    frame: false,
  });

  win.webContents.openDevTools({ mode: "detach" });

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

  ipcMain.on("fullscreen", (res) => {
    if (win.fullScreen) {
      win.fullScreen = false;
      return;
    }

    win.fullScreen = true;
  });

  ipcMain.on("minimize", () => {
    win.minimize();
  });

  ipcMain.on("maximize", () => {
    if (win.isMaximized()) {
      win.restore();

      return false;
    } else {
      win.maximize();

      return true;
    }
  });

  ipcMain.on("winClose", () => {
    win.close();
  });

  ipcMain.on("restore", () => {
    win.restore();
  });

  const customeMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(customeMenu);
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
  const localStorageDate = new Date(
    Date.now() - 3600 * 6 * 1000
  ).toLocaleDateString();

  return { day, time, date, localStorageDate };
});

ipcMain.handle("showAlert", async (event, { title, message }) => {
  await dialog.showMessageBox({
    type: "info",
    title: title || "Default title",
    message: message || "Defaul Message",
    buttons: ["OK"],
  });
});

ipcMain.handle("getDate", async (event, data) => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(
    "D:/Programming/Electron/PZTMonitoring/renderer/src/assets/Template.xlsx"
  );

  const ws = wb.getWorksheet("Total Output");
  ws.addRow(data);

  await wb.xlsx.writeFile(
    "D:/Programming/Electron/PZTMonitoring/renderer/src/assets/Template.xlsx"
  );
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
