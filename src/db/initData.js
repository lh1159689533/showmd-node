const Category = require('../model/Category');
const Tag = require('../model/Tag');
const ContentTheme = require('../model/ContentTheme');
const CodeTheme = require('../model/CodeTheme');
const User = require('../model/User');

// Markdown代码主题列表
const codeThemeList = [
  'abap',
  'algol',
  'algol_nu',
  'arduino',
  'autumn',
  'borland',
  'bw',
  'colorful',
  'dracula',
  'emacs',
  'friendly',
  'fruity',
  'github',
  'igor',
  'lovelace',
  'manni',
  'monokai',
  'monokailight',
  'murphy',
  'native',
  'paraiso-dark',
  'paraiso-light',
  'pastie',
  'perldoc',
  'pygments',
  'rainbow_dash',
  'rrt',
  'solarized-dark',
  'solarized-dark256',
  'solarized-light',
  'swapoff',
  'tango',
  'trac',
  'vim',
  'vs',
  'xcode',
  'ant-design',
];

// Markdown内容主题列表
const contentThemeList = [
  { value: 'Chinese-red', label: 'Chinese-red', path: 'http://localhost:1229/editor/theme' },
  { value: 'awesome-green', label: 'awesome-green', path: 'http://localhost:1229/editor/theme' },
];

Category.bulkCreate([
  { value: 'all', label: '综合' },
  { value: 'front-dev', label: '前端' },
  { value: 'backend-dev', label: '后端' },
]);

Tag.bulkCreate([
  { value: 'JavaScript', label: 'JavaScript', categoryValue: 'front-dev' },
  { value: 'Vue.js', label: 'Vue.js', categoryValue: 'front-dev' },
  { value: 'React.js', label: 'React.js', categoryValue: 'front-dev' },
  { value: 'CSS', label: 'CSS', categoryValue: 'front-dev' },
  { value: 'Node.js', label: 'Node.js', categoryValue: 'front-dev' },
  { value: 'TypeScript', label: 'TypeScript', categoryValue: 'front-dev' },

  { value: 'Java', label: 'Java', categoryValue: 'backend-dev' },
  { value: 'SQL', label: 'SQL', categoryValue: 'backend-dev' },
  { value: 'MySQL', label: 'MySQL', categoryValue: 'backend-dev' },
  { value: '算法', label: '算法', categoryValue: 'backend-dev' },
  { value: 'Python', label: 'Python', categoryValue: 'backend-dev' },
]);

ContentTheme.bulkCreate(contentThemeList);

CodeTheme.bulkCreate(
  codeThemeList.map((item) => ({
    value: item,
    label: item,
  }))
);

User.create({ id: 1, name: 'lanis', password: '123456' });
