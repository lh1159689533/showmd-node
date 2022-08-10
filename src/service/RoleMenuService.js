const RoleDao = require('../dao/RoleDao');
const Response = require('../utils/Response');

class RoleMenuService {
  constructor() {}

  /**
   * 根据角色查询菜单列表
   * @param {Number} roleId 角色id
   * @returns 菜单列表
   */
  async listMenuByRoleId(roleId) {
    const menus = await new RoleDao().findMenuByRoleId(roleId);
    return new Response().success(menus);
  }
}

module.exports = RoleMenuService;