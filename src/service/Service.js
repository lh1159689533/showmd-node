class Service {
  constructor(props) {
    if (props) {
      this.initProps(props);
    }
  }

  initProps(props) {
    for (let key in props) {
      this[key] = props[key];
    }
  }
}

module.exports = Service;