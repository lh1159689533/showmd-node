const IMAGE_TYPE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

module.exports = {
  isJson(str) {
    try {
      if (typeof JSON.parse(str) === 'object') {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  isImageFile(file) {
    const fileType = typeof file === 'string' ? file : file?.mimetype;
    return IMAGE_TYPE.includes(fileType);
  },

  isGIFImage(file) {
    const fileType = typeof file === 'string' ? file : file?.mimetype;
    return fileType === 'image/gif';
  },

  isPNGImage(file) {
    const fileType = typeof file === 'string' ? file : file?.mimetype;
    return fileType === 'image/png';
  },

  isJPGImage(file) {
    const fileType = typeof file === 'string' ? file : file?.mimetype;
    return fileType === 'image/jpg';
  }
};