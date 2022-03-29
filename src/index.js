const https = require('https');
const getConfig = require('./getConfig');
const getNotifyContent = require('./getNotifyContent');
const validateBeforeNotify = require('./validateBeforeNotify');

module.exports = async () => {
  const options = getConfig();
  const validateMsg = await validateBeforeNotify();
  if (validateMsg) {
    throw new Error(validateMsg);
  }
  const content = await getNotifyContent();
  if (content.length <= 0) {
    return;
  }
  const data = JSON.stringify({
    msgtype: 'text',
    text: {
      content,
      mentioned_mobile_list: '@all',
    },
  });
  const response = https.request(options.webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  });
  response.on('error', event => {
    throw new Error(event);
  });
  response.write(data);
  response.end();
}
