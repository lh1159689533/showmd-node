const Dao = require('./Dao');
const ContentTheme = require('../model/ContentTheme');

class ContentThemeDao extends Dao {
  constructor() {
    super(ContentTheme);
  }
}

module.exports = ContentThemeDao;
