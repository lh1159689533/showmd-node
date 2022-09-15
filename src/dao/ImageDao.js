const Dao = require('./Dao');
const Image = require('../model/Image');

class ImageDao extends Dao {
  constructor() {
    super(Image);
  }
}

module.exports = ImageDao;
