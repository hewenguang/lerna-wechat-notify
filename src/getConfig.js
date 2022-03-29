const lerna = require(`${process.env.INIT_CWD}/lerna.json`);

module.exports = () => {
  if (!lerna) {
    throw new Error('`lerna.json` 未找到');
  }
  const options = lerna['wechat-notify'];
  if (!options || !options.webhook || !options.url) {
    throw new Error('`lerna.json` 缺失 `wechat-notify` 字段');
  }
  return options;
};
