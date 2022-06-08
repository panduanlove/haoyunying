// 协和医院导出事件
document.getElementById('beijingxieheyiyuan').onclick = (event) => {
  event.preventDefault();
  window.electron.startExport('beijingxieheyiyuan');
};

// 中日友好医院
document.getElementById('zhongriyouhaoyiyuan').onclick = (event) => {
  event.preventDefault();
  window.electron.startExport('zhongriyouhaoyiyuan');
};
