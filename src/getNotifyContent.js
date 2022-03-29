const { promisify } = require('util');
const childProcess = require('child_process');
const getConfig = require('./getConfig');
const getChangLogByPath = require('./getChangLogByPath');

const exec = promisify(childProcess.exec);

module.exports = async () => {
  const options = getConfig();
  const tagResult = await exec('git tag --contains $(git rev-list --tags --max-count=1)');
  const info = [];
  const outs = tagResult.stdout.split(/\n+/);
  // eslint-disable-next-line no-restricted-syntax
  for (const out of outs) {
    if (out.length > 0) {
      const [,, name, version] = out.split(/@|\//);
      info.push({
        name,
        version,
        info: out,
        changeLogUrl: options.url.replace('{name}', name),
        changeLog: await getChangLogByPath(`packages/${name}`),
      });
    }
  }
  if (info.length <= 0) {
    return '';
  }
  const releases = info.map(out => [
    `${out.info} 发布啦 ~`,
    `更新日志如下：`,
    out.changeLog,
    `详细日志 👉🏻 ${out.changeLogUrl}\n`,
  ].join('\n'));
  releases.push(`使用 \`yarn add ${info.map(out => out.info).join(' ')} -D\` 更新最新版本哦 😬`);
  return releases.join('\n');
};
