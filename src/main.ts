import createrMap from './createrMap';
import ICreaterInterface, { hospitalKey } from './interface/ICreaterInterface'
const { app, ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { hospitalNameDic } = require('./util');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 接收开始导出通知
ipcMain.on('startExport', async (event: any, hospitalName: hospitalKey) => {
  const createMethod = (createrMap as ICreaterInterface)[hospitalName];
  const workbook = await createMethod();
  // 关闭loading
  event.sender.send('reply', 'close');
  const path = dialog.showSaveDialogSync({
    title: '存储到',
    defaultPath: hospitalNameDic[hospitalName] + '.xlsx'
  });
  // 取消选择路径
  if (!path) return;

  // 生成excel到对应选择的文件目录
  workbook.xlsx.writeFile(path, {
    encoding: 'utf8'
  }).then(() => {
    console.log('保存成功');
  }, () => {
    dialog.showErrorBox('提示', '保存失败！');
  });
});
