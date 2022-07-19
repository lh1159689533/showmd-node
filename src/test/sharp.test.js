const sharp = require('sharp');

sharp('public/个人博客样式1.jpg').webp().toFile('null.webp');
sharp('public/个人博客样式1.jpg').webp({ quality: 50 }).toFile('quality.webp');
// sharp('public/async-load-tree.gif', { animated: true }).webp().toFile('output.webp');