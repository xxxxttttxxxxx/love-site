/*
  网站基础配置。
  账号：chenyifeng
  密码：chenyifeng

  换密码：打开 tools/password.html 生成 SHA-256，然后替换 passwordHash。
  GitHub Pages 是静态网站，登录属于前端门锁，不要放身份证、银行卡、非常私密照片等敏感内容。
*/
const SITE_CONFIG = {
  siteTitle: "love you thousand years",
  coupleNames: "徐腾啸 × 陈意峰",
  ownerName: "徐腾啸",
  partnerName: "陈意峰",
  anniversaryDate: "2026-02-11",
  anniversaryDisplay: "2026.02.11",
  footerText: "love you thousand years · 这里永远偏向陈意峰",
  customDomain: "www.chenyifeng.cloud"
};

const SITE_USERS = [
  {
    username: "chenyifeng",
    displayName: "陈意峰",
    role: "admin",
    passwordHash: "b4cf8af27c87226cfbbb811d5d69e29e54e85d153aeb83625e685832df6c2006"
  }
];
