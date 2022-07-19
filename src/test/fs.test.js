const fs = require('fs');
const path = require('path');

async function read(dir) {
  const files = await fs.readdirSync(path.resolve(dir), { withFileTypes: true });
  const list = [];
  // files.map(async (f) => {
  //   if (f?.isDirectory()) {
  //     const fl = await read(`${dir}/${f.name}`);
  //     list.push(...fl);
  //   } else {
  //     list.push(f.name);
  //   }
  // });
  for (let i = 0, len = files.length; i < len; i++) {
    if (files[i]?.isDirectory()) {
      const fl = await read(`${dir}/${files[i].name}`);
      list.push(...fl);
    } else {
      list.push(files[i].name);
    }
  }
  console.log('list:', list);

  return list;
}

// read('src/test/demo/svg').then(res => {
//   console.log(res);
// });

// console.log(path.join(__dirname, 'temp'));
// console.log(path.join('temp'));
// console.log(path.resolve('temp', 'dd'));
// console.log(__dirname);
// console.log(__filename);

function mkdir(...args) {
  console.log(args);
  console.log(path.resolve(...args));
  // const result = fs.mkdirSync(path.resolve(), { recursive: true });
  // console.log(result);
}

// mkdir('temp1', 'temp2')

function write() {
  fs.writeFile(path.resolve('temp/2.md'), '111222', () => {});
}

write();