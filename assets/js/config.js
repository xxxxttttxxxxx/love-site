/*
  网站基础配置。
  修改这里后，上传覆盖同名文件即可生效。

  当前账号：chenyifeng
  当前密码：你自己设置的那个简单密码

  想换密码：
  1. 打开 tools/password.html
  2. 输入新密码，生成 SHA-256
  3. 把下面 passwordHash 替换掉

  提醒：GitHub Pages 是静态网站，登录属于前端门锁，不要放身份证、银行卡、非常私密照片等敏感内容。
*/
const SITE_CONFIG = {
  siteTitle: "love you thousand years",
  coupleNames: "徐腾啸 × 陈意峰",
  yourName: "徐腾啸",
  partnerName: "陈意峰",
  anniversaryDate: "2026-02-11",
  anniversaryDisplay: "2026.02.11",
  loginSubtitle: "输入你们设置的账号密码，进入这个只属于你们的小世界。",
  footerText: "love you thousand years · 徐腾啸 × 陈意峰"
};

const SITE_USERS = [
  {
    username: "chenyifeng",
    displayName: "徐腾啸",
    role: "admin",
    passwordHash: "b4cf8af27c87226cfbbb811d5d69e29e54e85d153aeb83625e685832df6c2006"
  }
];
