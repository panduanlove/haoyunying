/**
 * 北京协和医院医生出诊时间表
 */
const https = require('https');
const cheerio = require('cheerio');
const { createWorkbook, setColumn, setRow } = require('../worksheet');

const worksheetDic = {
  'https://www.pumch.cn/dsearchs/dockervisit/3/1.html?ajax=true': '普通门诊(东院)',
  'https://www.pumch.cn/dsearchs/dockervisit/3/2.html?ajax=true': '特需专家门诊(东院)',
  'https://www.pumch.cn/dsearchs/dockervisit/3/3.html?ajax=true': '国际医疗部门诊(东院)',
  'https://www.pumch.cn/dsearchs/dockervisit/2/1.html?ajax=true': '普通门诊(西院)',
  'https://www.pumch.cn/dsearchs/dockervisit/2/2.html?ajax=true': '特需专家门诊(西院)',
  'https://www.pumch.cn/dsearchs/dockervisit/2/3.html?ajax=true': '国际医疗部门诊(西院)'
};

// 脚本执行方法
async function createWorksheet () {
  const workbook = createWorkbook();
  const promises = [];
  for (const url in worksheetDic) {
    // 创建带颜色的sheet
    const worksheet = workbook.addWorksheet(worksheetDic[url], { properties: { tabColor: { argb: '01763a' } } });
    promises.push(getDoctorInfo(url, worksheet));
  }
  await Promise.all(promises);
  return workbook;
}

/**
 *
 * @param {需要爬取的url地址} url
 * @param {对应的sheet} worksheet
 * @returns
 */
function getDoctorInfo (url, worksheet) {
  return new Promise(function (resolve) {
    https.get(url, function (res) {
      // 分段返回的 自己拼接
      let html = '';
      // 有数据产生的时候 拼接
      res.on('data', function (chunk) {
        html += chunk;
      });
      // 拼接完成
      res.on('end', function () {
        worksheet.addRows(getData(html));
        setColumn(worksheet);
        setRow(worksheet);
        resolve(true);
      });
    });
  });
}

// 处理html，返回生成表格需要的数据
function getData (html) {
  const $ = cheerio.load(html);
  const data = [];
  const list = [];
  // 表头处理
  $('.tableth th').each(function (index, ele) {
    list.push($(ele).text().trim());
  });

  data.push(list);
  let facultyName = '';
  $('.h5-table tr').each(function (index, ele) {
    const result = [];
    $(ele).children().each(function (idx, el) {
      const item = $(el).text().trim().replace(/\n/g, '、').replace(/\s*/g, '');
      if (idx === 0 && !['上午', '下午', '晚上'].includes(item)) {
        facultyName = item;
      }
      if (idx === 0 && ['上午', '下午', '晚上'].includes(item)) {
        result.push(facultyName, item);
      } else {
        result.push(item);
      }
    });
    data.push(result);
  });
  return formatData(data);
}

/**
 * 格式化数据
 * @param {*} data
 * 返回如下格式数据
 *
 * [
      [ '科室', '时间', '日期', '医生' ],
      [ '整形外科门诊(西院)1', '上午', '2022.06.08星期三', '刘志飞' ],
      [ '整形外科门诊(西院)1', '上午', '2022.06.13星期一', '黄渭清' ],
      [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '邓姗' ],
      [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '周远征' ],
      [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '王含必' ],
      [ '妇科内分泌门诊(西院)', '下午', '2022.06.10星期五', '孙正怡' ]
   ]
 */
function formatData (data) {
  const weekDic = Object.create(null);
  const headList = data[0];
  const result = [
    ['科室', '时间', '日期', '医生']
  ];
  for (let i = 2; i < headList.length; i++) {
    weekDic[i] = headList[i];
  }
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const facultyName = row[0];
    const period = row[1];
    for (let i = 2; i < row.length; i++) {
      const doctorName = row[i];
      if (doctorName === '—') {
        continue;
      } else if (doctorName.includes('、')) {
        doctorName.split('、').forEach(doctor => {
          result.push([facultyName, period, weekDic[i], doctor]);
        });
      } else {
        result.push([facultyName, period, weekDic[i], doctorName]);
      }
    }
  }
  return result;
}

module.exports = {
  createBeijingxieheyiyuan: createWorksheet
};
