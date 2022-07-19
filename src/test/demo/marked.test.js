const { marked } = require('marked');
const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

const renderer = {
  codespan(code) {
    return `<code class='literal'>${code}</code>`;
  },
  table(header, body) {
    const ast = parse(`<>${header.replace(/\n/g, '')}${body.replace(/\n/g, '')}</>`, {
      plugins: ['jsx', 'typescript'],
    });

    // 表格的所有数据，包括header、body，存入一个二维数组，第一列为header数据，其他列为body数据
    let data = [];
    let align = [];
    const { children } = ast?.program?.body?.[0]?.expression ?? {}; // children为tr节点集合
    if (children?.length) {
      let index = 0;
      children.map((item) => {
        data[index] = [];
        item?.children.map((citem) => {
          // item.children为td、th节点集合
          data[index].push(citem?.children?.[0]?.value); // citem.children为文本节点集合，一般只有一个
          const attr0 = citem?.openingElement?.attributes?.[0]; // td、th的属性
          if (attr0?.name?.name === 'align') {
            // 目前只支持align属性
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
      table_columns.push(
        ...columns.map((col, i) => ({
          title: col,
          field: col,
          hozAlign: align[i],
          headerHozAlign: align[i],
          tooltip: true,
        }))
      );

      for (let i = 0, len1 = tdata.length; i < len1; i++) {
        let row_data = { id: i + 1 };
        for (let j = 0, len2 = Math.min(tdata[i].length, columns.length); j < len2; j++) {
          row_data[columns[j]] = tdata[i][j];
        }
        table_data.push(row_data);
      }
    }

    const tableId = `table-${new Date().valueOf()}`;

    return `
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
    `
      .split(/\n/)
      .map((item) => item.trim())
      .join(''); // 去掉换行及无意义的空格
  },
  blockquote(quote) {
    if (/注意(：|:\s*)/g.test(quote)) {
      return `
        <blockquote class='notice'>
          <div style='display:flex'>
            <i></i><span class='tips'>注意：</span>
          </div>
          ${quote.replace(/注意(：|:\s*)/g, '')}
        </blockquote>
      `;
    } else if (/说明(：|:\s*)/g.test(quote)) {
      return `
        <blockquote class='explain'>
          <div style='display:flex'>
            <i></i><span class='tips'>说明：</span>
          </div>
          ${quote.replace(/说明(：|:\s*)/g, '')}
        </blockquote>
      `;
    } else {
      return `<blockquote>${quote}</blockquote>`;
    }
  },
  image(href, title, text) {
    console.log(href, title, text);
    return `<img src="${encodeURIComponent(href)}" alt="${text}" title="${title}">`;
  },
};

const tokenizer = {
  code(code) {
    console.log(code);
  },
};

async function test() {
  const content = await fs.readFileSync(path.resolve('./src/demo/1.md'));
  // const content = await fs.readFileSync(path.resolve('./src/demo/笔记.md'));
  marked.setOptions({
    highlight: function (code, lang) {
      const hljs = require('highlight.js');
      const language = hljs.getLanguage(lang) ? lang : 'javascript';
      return hljs.highlight(code, { language }).value;
    },
    gfm: true,
    breaks: true,
  });

  marked.use({ renderer });
  // marked.use({ tokenizer });

  const code = marked.parse(content.toString());
  const html = `
    <!DOCTYPE html>
    <html lang="en" style='font-size:14px'>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="stylesheet" href="../../node_modules/highlight.js/styles/github.css">
        <style>
          .markdown-body {
            max-width:1280px;
            margin:0 auto;
            padding:0 20px;
          }
          .markdown-body>:first-child {
            margin-top: 0!important;
          }
          .markdown-body pre {
            padding: 10px;
            border-radius: 3px;
            background-color: rgb(252, 252, 252);
            border: 1px solid rgb(225, 225, 232);
          }
          .markdown-body code.literal {
            color: #e74c3c;
            background: #fff;
            white-space: nowrap;
            border: 1px solid #e1e4e5;
            overflow-x: auto;
            padding: 2px 5px;
          }
          .markdown-body li:nth-of-type(1) {
            padding: 4px 0 2px 0;
          }
          .markdown-body li {
            padding: 2px 0;
            line-height: 26px;
          }
          .markdown-body a {
            color: #006eff;
            text-decoration: none;
          }
          .markdown-body a:hover {
            text-decoration: underline;
          }
          .markdown-body blockquote {
            border-radius: 3px;
            margin-left: 0;
            line-height: 26px;
            padding: 10px 20px;
          }
          .markdown-body blockquote, .markdown-body blockquote.explain {
            background: #d5e7ff;
            color: #002da0;
            border-left: #2684ff 6px solid;
          }
          .markdown-body blockquote.notice {
            border-left: #ff9c19 6px solid;
            background: #ffe8d5;
            color: #a02800;
          }
          .markdown-body blockquote code {
            background: transparent!important;
            border: none!important;
          }
          .markdown-body blockquote > p, .markdown-body blockquote > p {
            margin: 6px 0 0 13px;
          }
          .markdown-body blockquote.notice i {
            width: 18px;
            height: 18px;
            background: url(./svg/notice.svg);
            background-size: 100% 100%;
            margin-top: 4px;
            margin-right: 10px;
          }
          .markdown-body blockquote.notice .tips {
            color: #ff9c19;
            font-weight: 700;
          }
          .markdown-body blockquote.explain i {
            width:20px;
            height:20px;
            padding:0px 8px 0 0;
            background: url(./svg/explain.svg);
            background-size: 100% 100%;
            margin-top:2px;
          }
          .markdown-body blockquote.explain .tips {
            color: #00a4ff;
            font-weight: 700;
          }
          .markdown-body h1, .markdown-body h2 {
            padding-bottom: 0.3em;
            border-bottom: 1px solid #eee;
          }
        </style>
      </head>
      <body style='margin:0'>`
    .split(/\n/)
    .map((item) => item.trim())
    .join('')
    .concat(`<div class='markdown-body'>${code}</div>`)
    .concat('</body></html>');

  fs.writeFileSync(path.resolve('./src/demo/2.html'), html, 'utf8');
}

function lexer() {
  const md = fs.readFileSync(path.resolve('./src/test/demo/1.md'));
  // const md = '```js 111```';
  const tokens = marked.lexer(md.toString());
  console.dir(tokens);
  fs.writeFileSync(path.resolve('./src/test/demo/1.json'), JSON.stringify(tokens));
}

// test();
// loadTheme();
lexer();