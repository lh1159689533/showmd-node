const { marked, options } = require('marked');
const fs = require('fs');
const path = require('path');
const renderer = require('./renderer');

class Marked {
  constructor(options = {}) {
    marked.setOptions({
      highlight: function (code, lang) {
        const hljs = require('highlight.js');
        const language = hljs.getLanguage(lang) ? lang : 'javascript';
        return hljs.highlight(code, { language }).value;
      },
      gfm: true,
      breaks: true,
      ...options,
    });

    marked.use({ renderer });
  }

  parse(content) {
    const code = marked.parse(content);
    // const tmpl = fs.readFileSync(path.resolve('public/template.html'));
    // const html = tmpl.toString().split(/\n/).map(item => item.trim()).join('')
    //                  .replace('<body></body>', `<body><div class="markdown-body">${code}</div></body>`);
    const html = `<div class="markdown-body">${code}</div>`;
    return html;
  }

}

module.exports = Marked;