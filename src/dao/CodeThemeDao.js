const Dao = require('./Dao');
const CodeTheme = require('../model/CodeTheme');

class CodeThemeDao extends Dao {
  constructor() {
    super(CodeTheme);
  }
}

module.exports = CodeThemeDao;
