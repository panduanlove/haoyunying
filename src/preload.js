const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  startExport: (hospitalName) => {
    showLoading();
    ipcRenderer.send('startExport', hospitalName);
  }
});

ipcRenderer.on('reply', function (event, type) {
  if (type === 'close') {
    hideLoading();
  }
});

function showLoading () {
  document.querySelector('.loading').style.display = 'block';
}

function hideLoading () {
  document.querySelector('.loading').style.display = 'none';
}
