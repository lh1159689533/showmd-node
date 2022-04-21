const { parse } = require('@babel/parser');

module.exports = function table(header, body) {
  const ast = parse(`<>${header.replace(/\n/g, '')}${body.replace(/\n/g, '')}</>`, {
    plugins: [
      "jsx",
      "typescript",
    ],
  });

  // 表格的所有数据，包括header、body，存入一个二维数组，第一列为header数据，其他列为body数据
  let data = [];
  let align = [];
  const { children } = ast?.program?.body?.[0]?.expression ?? {}; // children为tr节点集合
  if (children?.length) {
    let index = 0;
    children.map(item => {
      data[index] = [];
      item?.children.map(citem => { // item.children为td、th节点集合
        data[index].push(citem?.children?.[0]?.value); // citem.children为文本节点集合，一般只有一个
        const attr0 = citem?.openingElement?.attributes?.[0]; // td、th的属性
        if (attr0?.name?.name === 'align') { // 目前只支持align属性
          align.push(attr0?.value?.value);
        } else {
          align.push('left');
        }
      });
      index += 1;
    });
  }

  const table_data = [];
  const table_columns = [];
  const [columns, ...tdata] = data;
  if (columns?.length) {
    table_columns.push(...columns.map((col, i) => ({
      title: col,
      field: col,
      hozAlign: align[i],
      headerHozAlign: align[i],
      tooltip: true
    })));

    for (let i = 0, len1 = tdata.length; i < len1; i++) {
      let row_data = { id: i + 1 };
      for (let j = 0, len2 = Math.min(tdata[i].length, columns.length); j < len2; j++) {
        row_data[columns[j]] = tdata[i][j];
      }
      table_data.push(row_data);
    }
  }

  const tableId = `table-${new Date().valueOf()}`;

  return (`
    <!--  引入Tabulator表格样式文件 -->
    <link href="https://unpkg.com/tabulator-tables/dist/css/tabulator_semanticui.min.css" rel="stylesheet">
    <!-- 引入Tabulator表格依赖文件 -->
    <script type="text/javascript" src="https://unpkg.com/tabulator-tables/dist/js/tabulator.min.js"></script>
    <!--  Tabulator表格插槽 -->
    <div id='${tableId}'></div>
    <!--  初始化Tabulator表格 -->
    <script type="module">
      /*  引入Tabulator表格依赖文件 */
      /* import { Tabulator } from 'https://unpkg.com/tabulator-tables/dist/js/tabulator_esm.min.js'; */
      new Tabulator('#${tableId}', {
        data: ${JSON.stringify(table_data)},
        columns: ${JSON.stringify(table_columns)},
        height: '${table_data?.length > 5 ? '260px' : 'auto'}',
        layout: 'fitColumns',
      });
    </script>
  `.split(/\n/).map(item => item.trim()).join('')); // 去掉换行及无意义的空格
};