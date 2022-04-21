const { marked, options } = require('marked');
const fs = require('fs');
const path = require('path');
const { image, ...renderer } = require('./renderer');
const logger = require('../logger');

class Marked {
  constructor({ downImage = false, ...options }) {
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

    const _renderer = { ...renderer };
    if (downImage) {
      _renderer.image = image;
    }

    marked.use({ renderer: _renderer });
  }

  async parse(content) {
    const code = marked.parse(content);
    const tmpl = await fs.readFileSync(path.resolve('/public/template.html'));
    const html = tmpl.toString().split(/\n/).map(item => item.trim()).join('')
                     .replace('<body></body>', `<body><div class='markdown-body'>${code}</div></body>`);
    return html;
  }

}

module.exports = Marked;