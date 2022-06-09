import createBeijingxieheyiyuan from './crawler/beijingxieheyiyuan';
import createZhongriyouhaoyiyuan from './crawler/zhongriyouhaoyiyuan';

export default {
  // key 值与点击按钮的id对应，value 是对应医院的导出方法
  beijingxieheyiyuan: createBeijingxieheyiyuan,
  zhongriyouhaoyiyuan: createZhongriyouhaoyiyuan
}
