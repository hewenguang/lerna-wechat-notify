# lerna-wechat-notify

lerna 发包之后企业微信群通知（借助群机器人实现）

## 使用

### 安装

```bash
yarn add lerna-wechat-notify -D
```

### 增加配置

在配置文件 `lerna.json` 增加字段如下

```json
{
  // 用来生成通知消息
  "wechat-notify": {
    "url": "https://github.com/stylelint/{name}/blob/main/CHANGELOG.md", // {name} 会自动替换成对应的包名
    "webhook": "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=e0f79397-04fd-460a-a3c2-7cd9e9940a7a" // 机器人 webhook 地址
  }
}
```

生成机器人 webhook 地址：在某个群组右侧点击菜单选择“添加机器人”，起个名字之后提交，就可以看到当前机器人的地址。可以在[这里]( https://developer.work.weixin.qq.com/document/path/91770)查看企业微信群机器人文档

### 接入命令

在 `package.json` 文件的 `scripts` 找到 `lerna publish` 命令，在后面追加 `lerna-wechat-notify`。完成的样子类似下面👇🏻

```json
{
  "scripts": {
    "publish": "lerna publish && lerna-wechat-notify"
  }
}
```
