const { promisify } = require('util');
const childProcess = require('child_process');
const getConfig = require('./getConfig');
const getChangLogByPath = require('./getChangLogByPath');

const exec = promisify(childProcess.exec);

module.exports = async () => {
  const options = getConfig();
  const { stdout } = await exec('git tag --contains $(git rev-list --tags --max-count=1)');
  const info = [];
  const outs = stdout.split(/\n+/);

  // eslint-disable-next-line no-restricted-syntax
  for (const out of outs) {
    if (out.length > 0) {
      const outInfos = out.split(/@|\//);
      const version = outInfos.pop();
      const name = outInfos.pop();
      name && version && info.push({
        name,
        version,
        info: out,
        changeLog: await getChangLogByPath(`packages/${name}`),
        changeLogUrl: options.changeLogUrl.replace('{name}', name),
      });
    }
  }
  if (info.length <= 0) {
    return '';
  }
  const releases = info.map(out => [
    `# <font color="info">${out.info}</font>`,
    `更新日志如下：`,
    out.changeLog,
    `👉🏻 [完整日志](${out.changeLogUrl})`,
    '   ',
  ].join('\n'));
  return releases.join('\n');
};
