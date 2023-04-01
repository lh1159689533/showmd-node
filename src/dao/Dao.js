const { isJsonString } = require('../utils/dataParser');
class Dao {
  constructor(model) {
    this.model = model;
  }

  /**
   * 新增/更新，id有值则更新
   * @param {Model} modelData 
   */
  async save(modelData) {
    if (modelData?.id) {
      const [isSucc, err] = await this.update(modelData);
      if (isSucc) {
        return [modelData.id, null];
      } else {
        return [null, err];
      }
    }
    return await this.insert(modelData);
  }

  async insert(modelData) {
    try {
      const result = await this.model.create(modelData);
      return [result?.id, null];
    } catch (e) {
      return [null, e];
    }
  }

  async update(modelData) {
    try {
      const primaryKey = this.model.primaryKeyAttribute;
      const primaryKeyValue = modelData[primaryKey];
      modelData.updateTime = new Date();
      const result = await this.model.update(modelData, { where: { [primaryKey]: primaryKeyValue } });
      return [result !== 0];
    } catch (e) {
      return [null, e];
    }
  }

  async findById(id) {
    const modelData = await this.model.findByPk(id);
    return modelData?.toJSON();
  }

  async findOne(where) {
    if (!where) return null;
    const modelData = await this.model.findOne({ where });
    return modelData?.toJSON();
  }

  async findAll() {
    try {
      const modelDatas = await this.model.findAll();
      return [modelDatas?.map((md) => md?.toJSON()), null];
    } catch (e) {
      return [null, e];
    }
  }

  async findByPage(page) {
    const { pageNo, pageSize } = page;
    const modelDatas = await this.model.findAll({ offset: pageNo - 1, limit: pageSize });
    const data = {
      total: await this.model.count(),
      pageNo,
      pageSize,
      list: modelDatas?.map((md) => md?.toJSON()),
    };
    return data;
  }

  async delete(id) {
    const primaryKey = this.model.primaryKeyAttribute;
    const result = await this.model.destroy({ where: { [primaryKey]: id } });
    return result !== 0;
  }

  /**
   * 将sequelize查询数据库返回的ModelData转为JSON
   * @param {Model} data 
   * @returns JSON
   */
  toJson(data) {
    const jsonStr = JSON.stringify(data, null, 2);
    if (isJsonString(jsonStr)) {
      return JSON.parse(jsonStr);
    }
    return data;
  }
}

module.exports = Dao;
