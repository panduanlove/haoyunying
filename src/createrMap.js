const { createBeijingxieheyiyuan } = require('./crawler/beijingxieheyiyan');
const { createZhongriyouhaoyiyuan } = require('./crawler/zhongriyouhaoyiyuan');

module.exports = {
  // key 值与点击按钮的id对应，value 是对应医院的导出方法
  beijingxieheyiyuan: createBeijingxieheyiyuan,
  zhongriyouhaoyiyuan: createZhongriyouhaoyiyuan
};
