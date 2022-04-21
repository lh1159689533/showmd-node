const ora = require('ora');
const chalk = require('chalk');

class Spinner {
  constructor(text) {
    this.spinner = ora(text).start();
  }

  start(text) {
    this.spinner.text = text;
  }

  succeed(text) {
    this.spinner.succeed(chalk.green(text));
  }

  fail(text) {
    this.spinner.fail(chalk.red(text));
  }

  warn(text) {
    this.spinner.warn(chalk.yellow(text));
  }

  info(text) {
    this.spinner.info(chalk.blue(text));
  }
}

const SpinnerFactory = () => {
  return new Spinner();
};

module.exports = SpinnerFactory();