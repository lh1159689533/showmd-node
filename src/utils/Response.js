const FAIL = 1;
const SUCC = 0;

class Response {
  constructor(code, message, data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  success(data, message = "success") {
    this.code = SUCC;
    this.message = message;
    this.data = data;

    return this.toString();
  }

  fail(message = "failed") {
    this.code = FAIL;
    this.message = message;
    this.data = null;

    return this.toString();
  }

  toString() {
    return JSON.stringify(this);
  }
}

module.exports = Response;