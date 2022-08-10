const fs = require('fs').promises;
const path = require('path');
const Category = require('../model/Category');
const ContentTheme = require('../model/ContentTheme');
const CodeTheme = require('../model/CodeTheme');
const Role = require('../model/Role');
const User = require('../model/User');
const Avatar = require('../model/Avatar');
const Menu = require('../model/Menu');
const RoleMenu = require('../model/RoleMenu');

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
  { value: 'all', label: '综合', parentValue: '0' },
  { value: 'front-dev', label: '前端', parentValue: '0' },
  { value: 'backend-dev', label: '后端', parentValue: '0' },

  { value: 'JavaScript', label: 'JavaScript', parentValue: 'front-dev' },
  { value: 'Vue.js', label: 'Vue.js', parentValue: 'front-dev' },
  { value: 'React.js', label: 'React.js', parentValue: 'front-dev' },
  { value: 'CSS', label: 'CSS', parentValue: 'front-dev' },
  { value: 'Node.js', label: 'Node.js', parentValue: 'front-dev' },
  { value: 'TypeScript', label: 'TypeScript', parentValue: 'front-dev' },

  { value: 'Java', label: 'Java', parentValue: 'backend-dev' },
  { value: 'SQL', label: 'SQL', parentValue: 'backend-dev' },
  { value: 'MySQL', label: 'MySQL', parentValue: 'backend-dev' },
  { value: '算法', label: '算法', parentValue: 'backend-dev' },
  { value: 'Python', label: 'Python', parentValue: 'backend-dev' },
]);

ContentTheme.bulkCreate(contentThemeList);

CodeTheme.bulkCreate(
  codeThemeList.map((item) => ({
    value: item,
    label: item,
  }))
);

Role.create({ id: 1, name: '超级管理员' });
User.create({ id: 1, name: 'Lanis', password: '123456', roleId: 1 });

Menu.bulkCreate([
  { title: '首页', path: '/' },
  { title: '技术博客', path: '/blog' },
  { title: '资源客栈', path: '/source' },
  { title: '写意人生', path: '/lift' },
]).then(menus => {
  RoleMenu.bulkCreate(menus?.map(m => ({
    roleId: 1,
    menuId: m.id
  })));
});

fs.readFile(path.resolve('public/avatars.jpeg')).then(buffer => {
  Avatar.create({ content: buffer, userId: 1 });
}).catch(e => {
  console.log(e);
});