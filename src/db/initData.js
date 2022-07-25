const Category = require('../model/Category');
const Tag = require('../model/Tag');
const User = require('../model/User');

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

User.create({ name: 'lanis', password: '123456' });