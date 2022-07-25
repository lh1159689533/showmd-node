class Dao {
  constructor(model) {
    this.model = model;
  }
  async save(modelData) {
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
  async findAll() {
    const modelDatas = await this.model.findAll();
    return modelDatas?.map((md) => md?.toJSON());
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
}

module.exports = Dao;
