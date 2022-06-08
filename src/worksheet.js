const Excel = require('exceljs');

/**
 * 创建、设置工作表相关
 */
function createWorkbook () {
  const workbook = new Excel.Workbook();
  // 基本的创建信息
  workbook.creator = 'Me';
  workbook.lastModifiedBy = 'Her';
  workbook.created = new Date(1985, 8, 30);
  workbook.modified = new Date();
  workbook.lastPrinted = new Date(2016, 9, 27);
  // 视图大小， 打开Excel时，整个框的位置，大小
  workbook.views = [
    {
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible'
    }
  ];
  return workbook;
}

// 设置列
function setColumn (worksheet) {
  // 设置列
  worksheet.columns = [
    { key: 'facultyName', width: 40 },
    { key: 'period', width: 15 },
    { key: 'date', width: 40 },
    { key: 'doctor', width: 40 }
  ];
}

// 设置行
function setRow (worksheet) {
  // 设置行
  worksheet.eachRow(function (row, rowNumber) {
    row.height = 30;
    row.eachCell(function (cell) {
      // 表头样式
      if (rowNumber === 1) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '01763a' },
          bgColor: { argb: 'ffffff' }
        };
        cell.font = {
          name: 'Arial',
          color: { argb: 'ffffff' },
          family: 2,
          size: 14
        };
      } else {
        cell.font = {
          name: 'Arial',
          color: { argb: '000000' },
          family: 2,
          size: 12
        };
      }
      // 设置单元格对齐方式
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
    });
  });
}

module.exports = {
  createWorkbook,
  setColumn,
  setRow
};
