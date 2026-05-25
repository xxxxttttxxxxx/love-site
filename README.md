# love you thousand years - 高级 UI + 动态日历版

这是 GitHub Pages 静态网站版本，不需要服务器，不需要 PHP，不需要数据库。

## 当前账号

上线后建议换复杂密码：打开 `tools/password.html` 生成 SHA-256，再改 `assets/js/config.js`。

## 常改文件

- 基础信息、账号：`assets/js/config.js`
- 文案、故事、日历事件、相册、日记、愿望：`assets/js/content.js`
- 样式：`assets/css/style.css`
- 照片：`uploads/album/`

## 上传照片

1. 把照片上传到 `uploads/album/`
2. 修改 `assets/js/content.js` 里的 album 数组
3. 例如：`src: "uploads/album/travel1.jpg"`

## 注意

GitHub Pages 是静态网站，登录属于前端门锁，不要放身份证、银行卡、真实住址、非常私密照片等敏感内容。
