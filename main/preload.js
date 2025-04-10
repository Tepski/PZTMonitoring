const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  getTime: () => ipcRenderer.invoke("get-time"),
});
