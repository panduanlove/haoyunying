/**
 * 中日友好医院医生出诊时间表
 */
const { request } = require('../util');
const { createWorkbook, setColumn, setRow } = require('../worksheet');

const periodDic = {
  1: '上午',
  2: '下午'
};
console.log(111);
const zhongriUrl = 'https://www.zryhyy.com.cn/schedul_interface/scheduling/schedulDataByHosCode';

const worksheetDic = {
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=001': '本部',
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=003': '北区',
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=002': '西区',
  'https://www.zryhyy.com.cn/schedul_interface/scheduling/getDeptlist?hosCode=004': '国际部'
};

// 脚本执行方法
async function createWorksheet () {
  const workbook = createWorkbook();
  for (const url in worksheetDic) {
    // 创建带颜色的sheet
    const worksheet = workbook.addWorksheet(worksheetDic[url], { properties: { tabColor: { argb: '01763a' } } });
    await getData(url, worksheet);
  }
  return workbook;
}

// 处理html，返回生成表格需要的数据
async function getData (url, worksheet) {
  const result = [
    ['科室', '时间', '日期', '医生']
  ];
  const promises = [];
  const data = await request(url);
  // 获取科室列表
  const { data: facultyList } = JSON.parse(data);
  for (const faculty of facultyList) {
    promises.push(
      request(`${zhongriUrl}?hosCode=${faculty.hospitalcode}&depCode=${faculty.code1}`)
    );
  }
  const datas = await Promise.all(promises);
  for (const list of datas) {
    const { data: menzhenInfo } = JSON.parse(list);
    for (const facultyName in menzhenInfo) {
      const detail = menzhenInfo[facultyName];
      for (const period in detail) {
        const dateInfo = detail[period];
        for (const date in dateInfo) {
          for (const doctor of dateInfo[date]) {
            result.push([doctor.deptname, periodDic[period], date, doctor.doctname]);
          }
        }
      }
    }
  }
  worksheet.addRows(result);
  setColumn(worksheet);
  setRow(worksheet);
  return result;
}

module.exports = {
  createZhongriyouhaoyiyuan: createWorksheet
};
