const DB = require('../db');

async function insert() {
  const db = new DB();
  // db.insert('test', [['a']], ['name']);
  const [e, project] = await db.select('user', { id: 1 });
  console.log(e);
  console.log(project);
}

insert();