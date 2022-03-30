const lerna = require(`${process.env.INIT_CWD}/lerna.json`);

module.exports = () => {
  if (!lerna) {
    throw new Error('`lerna.json` 未找到');
  }
  const options = lerna['work-wechat'];
  if (!options || !options.webhook || !options.changeLogUrl) {
    throw new Error('`lerna.json` 缺失 `work-wechat` 字段');
  }
  return options;
};
