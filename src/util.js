const https = require('https');
function request (url) {
  return new Promise(function (resolve) {
    https.get(url, function (res) {
      // 分段返回的 自己拼接
      let data = '';
      // 有数据产生的时候 拼接
      res.on('data', function (chunk) {
        data += chunk;
      });
      // 拼接完成
      res.on('end', function () {
        resolve(data);
      });
    });
  });
}

const hospitalNameDic = {
  beijingxieheyiyuan: '北京协和医院',
  zhongriyouhaoyiyuan: '中日友好医院'
};

module.exports = {
  request,
  hospitalNameDic
};
