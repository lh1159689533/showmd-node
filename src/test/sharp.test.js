const sharp = require('sharp');

// sharp('public/个人博客样式1.jpg').webp().toFile('null.webp');
// sharp('public/个人博客样式1.jpg').webp({ quality: 50 }).toFile('quality.webp');
sharp('src/test/Web Developer_Flatline.svg', { animated: false }).resize({ width: 200, height: 160, fit: 'fill' }).webp().trim().toFile('output1.webp');