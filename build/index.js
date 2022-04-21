const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const spinner = require('../src/utils/spinner');
const { pkg, main } = require('./config.json');

const outputPath = pkg.outputPath || 'dist';

async function init() {
  spinner.start('开始打包...\n');
  try {
    await exec(`rm -rf ./${outputPath}`);
    await exec(`pkg ${main} --config ./config.json`, {
      cwd: path.resolve('./build')
    });
    spinner.succeed('打包完成.');
  } catch (e) {
    spinner.fail('打包失败!');
    console.log(e.message);
  }
}

init();
