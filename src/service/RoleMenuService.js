const RoleDao = require('../dao/RoleDao');
const Response = require('../utils/Response');
const { ROLE_TYPE } = require('../constant');

class RoleMenuService {
  constructor() {}

  /**
   * 根据角色查询菜单列表
   */
  async listMenu(roleId = ROLE_TYPE.NORMAL) {
    const menus = await new RoleDao().findMenuByRoleId(roleId);
    return new Response().success(menus);
  }
}

module.exports = RoleMenuService;