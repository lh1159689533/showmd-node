class Service {
  constructor(props) {
    for (let key in props) {
      this[key] = props[key];
    }
  }
}

module.exports = Service;