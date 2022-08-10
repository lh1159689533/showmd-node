const fs = require('fs').promises;
const path = require('path');

async function read() {
  const f = await fs.readFile(path.resolve('public/avatars.jpeg'));
  console.log(f);
  fs.writeFile('log', f);
}

read();