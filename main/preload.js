const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  getTime: () => ipcRenderer.invoke("get-time"),
  fullscreen: (res) => ipcRenderer.send("fullscreen"),
  minimize: () => ipcRenderer.send("minimize"),
  maximize: () => ipcRenderer.send("maximize"),
  winClose: () => ipcRenderer.send("winClose"),
  restore: () => ipcRenderer.send("restore"),
});
l