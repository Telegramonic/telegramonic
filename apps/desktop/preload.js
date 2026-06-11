const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close'),
  checkConnection: async () => {
    try {
      const start = Date.now();
      // Check connection to Telegram API endpoint or standard public check
      await fetch('http://127.0.0.1:50065', {
        mode: 'no-cors',
        cache: 'no-store',
      });
      return { status: 'connected', latency: Date.now() - start };
    } catch (e) {
      return { status: 'disconnected', latency: null };
    }
  },
  setDockIcon: (dataUrl) => ipcRenderer.send('set-dock-icon', dataUrl),
  downloadFileDirectly: (url, filename) =>
    ipcRenderer.invoke('download-file-directly', { url, filename }),
  openExternal: (url) => ipcRenderer.send('open-external', url),
});
