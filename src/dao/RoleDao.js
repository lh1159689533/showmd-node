const Dao = require('./Dao');
const Role = require('../model/Role');
const Menu = require('../model/Menu');

class RoleDao extends Dao {
  constructor() {
    super(Role);
  }

  /**
   * 根据角色查询菜单列表
   * @param {Number} roleId 角色id
   * @returns 菜单列表
   */
  async findMenuByRoleId(roleId) {
    const roleMenu = await Role.findByPk(roleId, { include: { model: Menu, through: { attributes: [] } } });
    if (roleMenu) {
      return roleMenu.toJSON().menus;
    }
    return [];
  }
}

module.exports = RoleDao;