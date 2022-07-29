const ContentThemeDao = require('../Dao/ContentThemeDao');
const CodeThemeDao = require('../Dao/CodeThemeDao');
const Response = require('../utils/Response');

class ThemeService {
  constructor() {}

  async listContentTheme() {
    const res = new Response();
    const [list, err] = await new ContentThemeDao().findAll();
    if (err) {
      return res.fail('查询内容主题出错');
    }
    return res.success(list);
  }

  async listCodeTheme() {
    const res = new Response();
    const [list, err] = await new CodeThemeDao().findAll();
    if (err) {
      return res.fail('查询代码主题出错');
    }
    return res.success(list);
  }
}

module.exports = ThemeService;