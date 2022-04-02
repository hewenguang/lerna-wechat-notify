const { promisify } = require('util');
const path = require('path');
const childProcess = require('child_process');

const exec = promisify(childProcess.exec);

/**
 * parse json safely
*/
function parseSafely(value) {
  if (typeof value !== 'string') {
    return value;
  }
  let parsedValue = {};
  try {
    parsedValue = JSON.parse(value);
  } catch (e) {
    // do nothing
  }
  return parsedValue;
}

/**
 * main
*/
module.exports = async filePath => {
  const pkgPath = `${process.env.INIT_CWD}/${filePath}/package.json`;
  const { version } = require(path.resolve(__dirname, pkgPath));
  const changeLogPath = `${process.env.INIT_CWD}/${filePath}/CHANGELOG.md`;
  const originChangeLog = await exec(`m2j -c ${path.resolve(__dirname, changeLogPath)}`);
  const { CHANGELOG: { content } } = parseSafely(originChangeLog.stdout);
  const items = content.split(/\n+/);
  const start = items.findIndex(item => new RegExp(`^#+\\s+\\[${version}\\]`).test(item));
  const end = items.findIndex((item, index) => index > start && /^#+\s+\[(\d|\.)+\]/.test(item));
  if (start < 0 || end < 0) {
    return '';
  }
  const changelog = items.slice(start + 1, end);
  return changelog.join('\n');
};
