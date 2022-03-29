const { promisify } = require('util');
const childProcess = require('child_process');

const exec = promisify(childProcess.exec);

module.exports = async () => {
  const { stdout } = await exec('git status -s');
  if (stdout.length > 0) {
    const untracked = stdout.replace(/\?\?|M/g, '').trim().split('\n');
    if (untracked.length > 0) {
      return '存在未提交的代码修改';
    }
  }
};
