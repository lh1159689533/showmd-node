module.exports = {
  /**
   * 判断是否为Json字符串
   * @param str 字符串
   * @returns true 是Json字符串，否则不是
   */
  isJsonString(str) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};
