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
  { value: 'front-dev', label: '前端' },
  { value: 'backend-dev', label: '后端' },
]);

Tag.bulkCreate([
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Vue.js', label: 'Vue.js' },
  { value: 'React.js', label: 'React.js' },
  { value: 'CSS', label: 'CSS' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'TypeScript', label: 'TypeScript' },
]);

ContentTheme.bulkCreate(contentThemeList);

CodeTheme.bulkCreate(
  codeThemeList.map((item) => ({
    value: item,
    label: item,
  }))
);

User.create({ id: 1, name: 'lanis', password: '123456' });
