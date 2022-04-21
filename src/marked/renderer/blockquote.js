const rules = [
  { key: 'notice', test: /注意(：|:\s*)/ },
  { key: 'explain', test: /说明(：|:\s*)/ },
];

function execRules(quote) {
  for (let i = 0, len = rules.length; i < len; i++) {
    const match = rules[i].test.exec(quote);
    if (match) {
      return [rules[i].key, match[0]];
    }
  }

  return null;
}

module.exports = function blockquote(quote) {
  const r = execRules(quote);
  if (r) {
    return (`
        <blockquote class='${r[0]}'>
          <div style='display:flex'>
            <i></i><span class='tips'>${r[1]}</span>
          </div>
          ${quote.replace(r[1], '')}
        </blockquote>
      `);
  } else {
    return `<blockquote>${quote}</blockquote>`;
  }
};