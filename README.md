# Docker 从入门到实践 微信小程序

<p align="center">
<img width="200" src="https://user-images.githubusercontent.com/16733187/49682252-3ac4c500-faec-11e8-86ab-eafe0139be6b.jpg">
</p>

<p align="center"><strong>微信扫码 随时随地阅读！</strong></p>

- https://github.com/yeasy/docker_practice

## TODO

- [x] 评论功能，与 GitHub Issue 互通
- [x] 支持多种字体
- [x] 阅读模式(明亮、暗黑)
- [x] 签到获取积分
- [ ] 积分兑换特权
- [x] 目录云更新

## 使用说明

## 开发者

- `$ npm -g i typescript miniprogram-ci`
- **可选** 复制 `SUMMARY.md` 到 `summary/summary.source.md`
- 安装依赖 `$ cd client ; npm install`
- 执行 `$ npm run gitbook:summary:generate`
- 执行 `$ npm run gitbook:summary:towxml`
- [ 微信开发者工具 -> 工具 -> 构建 npm ](项目贡献者) 或者 `$ npm run npm:build`(项目所有者[因为需要私钥])
- 编译
- 上传预览 `$ npm run upload` (项目所有者)

## 致谢

- https://github.com/sbfkcel/towxml
- https://github.com/tencent/weui-wxss
- https://github.com/TalkingData/iview-weapp
