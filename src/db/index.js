const sqlite = require('sqlite3').verbose();
const path = require('path');
const logger = require('../logger');

/**
 * 数据库sqlite3的操作类
 */
class DB {
  #db = null;
  constructor() {
    this.#db = new sqlite.Database(path.resolve('db/showmarkdown.db'));
  }

  createTable(table, params) {
    let createSql = `CREATE TABLE IF NOT EXISTS ${table}(`
    for (let key in params) {
      createSql += `${key} ${params[key]},`;
    }
    createSql += `PRIMARY KEY(id));`;

    return new Promise(resolve => {
      this.#db.run(createSql, (err) => {
        resolve([err]);
      });
    });
  }

  /**
   * 条件查询
   * @param {String} table 表名
   * @param {Object} wheres 条件: INTEGER类型字段支持'=', TEXT类型字段支持'=、like、!='; { id: 1, name: '!hui', skill: '%node%'} ==> where id=1 and name!='hui' and skill like '%node%'
   * @param {Array} columns 需要查询表中的那些字段; [ 'id', 'name' ] ==> select id, name from ..., 如果为空或undefined则查全部字段: select * from ...
   * @returns Promise
   */
  select(table, wheres = {}, columns = []) {
    let selectSql = (columns.length > 0 && columns || ['*']).reduce((acc, key) => {
      return acc + key + ',';
    }, `SELECT `).slice(0, -1);

    selectSql = Object.keys(wheres).reduce((acc, key) => {
      const value = wheres[key];
      let whe = ` AND ${key} = `;
      if (typeof value === 'string') {
        whe += `'${value}'`;
      } else {
        whe += `${value}`;
      }
      return acc + whe;
    }, `${selectSql} FROM ${table} WHERE 1=1`);

    logger.debug(`select sql: ${selectSql}`);

    return new Promise((resolve) => {
      this.#db.get(selectSql, (err, row) => {
        resolve([err, row]);
      });
    });
  }

  selectAll(table, wheres = {}, columns = []) {
    let selectSql = (columns.length > 0 && columns || ['*']).reduce((acc, key) => {
      return acc + key + ',';
    }, `SELECT `).slice(0, -1);

    selectSql = Object.keys(wheres).reduce((acc, key) => {
      const value = wheres[key];
      let whe = ` AND ${key}`;
      if (typeof value === 'string') {
        if (value.startsWith('!')) {
          whe += ` != '${value.replace('!', '')}'`;
        } else if (value.startsWith('%')) {
          whe += ` LIKE '${value}'`;
        } else {
          whe += ` = '${value}'`;
        }
      } else {
        whe += ` = ${value}`;
      }
      return acc + whe;
    }, `${selectSql} FROM ${table} WHERE 1=1`);

    logger.debug(`select all sql: ${selectSql}`);
    
    return new Promise((resolve) => {
      this.#db.all(selectSql, (err, rows) => {
        resolve([err, rows]);
      });
    });
  }

  insert(table, values, columns = []) {
    if (!values || values.length <= 0) {
      return Promise.reject(new Error('insert函数第二个参数必填'));
    }
    let insertSql = `INSERT INTO ${table}`;
    columns.length > 0 && (insertSql += `('${columns.join("','")}')`);
    insertSql = values.reduce((acc, item) => {
      return acc + `('${item.join("','")}'),`;
    }, insertSql + ' values').slice(0, -1);

    logger.debug(`insert sql: ${insertSql}`);
    
    return new Promise(resolve => {
      this.#db.run(insertSql, err => resolve([err]));
    });
  }

  close() {
    return new Promise(resolve => {
      this.#db.close(err => resolve([err]));
    });
  }

  update(table, wheres) {
  }

  /**
   * 条件删除列
   * @param {String} table 表名
   * @param {Object} wheres 条件: INTEGER类型字段支持'=', TEXT类型字段支持'=、like、!='; { id: 1, name: '!hui', skill: '%node%'} ==> where id=1 and name!='hui' and skill like '%node%'
   * @returns Promise
   */
  delete(table, wheres = {}) {
    Object.keys(wheres).length <= 0 && Promise.resolve([new Error('delete error')]);
    let deleteSql = Object.keys(wheres).reduce((acc, key) => {
      const value = wheres[key];
      let whe = ` AND ${key}`;
      
      if (typeof value === 'string') {
        if (value.startsWith('!')) {
          whe += ` != '${value.replace('!', '')}'`;
        } else if (value.startsWith('%')) {
          whe += ` LIKE '${value}'`;
        } else {
          whe += ` = '${value}'`;
        }
      } else {
        whe += ` = ${value}`;
      }
      return acc + whe;
    }, `DELETE FROM ${table} WHERE 1=1`);

    logger.debug(`delete sql: ${deleteSql}`);
    
    return new Promise(resolve => {
      this.#db.run(deleteSql, err => resolve([err]));
    });
  }

  clearAll(table) {
    const clearAllSql = `DELETE FROM ${table}`;

    logger.debug(`clear all sql: ${clearAllSql}`);
    
    return new Promise(resolve => {
      this.#db.run(clearAllSql, err => resolve([err]));
    });
  }

  execute() {
  }
}

module.exports = DB;