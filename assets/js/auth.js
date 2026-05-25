const SESSION_KEY = "love_site_session_v3";

async function sha256(text) {
  if (window.crypto && crypto.subtle && window.TextEncoder) {
    try {
      const data = new TextEncoder().encode(text);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {}
  }
  return sha256Fallback(text);
}

function sha256Fallback(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i, j;
  const result = "";
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = sha256Fallback.h = sha256Fallback.h || [];
  const k = sha256Fallback.k = sha256Fallback.k || [];
  let primeCounter = k[lengthProperty];
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += "\x80";
  while (ascii[lengthProperty] % 64 - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (w[i - 16]
          + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
          + w[i - 7]
          + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  let hex = "";
  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      hex += ((b < 16) ? 0 : "") + b.toString(16);
    }
  }
  return hex;
}

function setSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    loginAt: Date.now()
  }));
}

function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

function requireLogin() {
  const session = getSession();
  if (!session) window.location.href = "./index.html";
  return session;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "./index.html";
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const msg = document.getElementById("loginMsg");
    msg.textContent = "正在验证...";
    const user = SITE_USERS.find(u => u.username === username);
    const passwordHash = await sha256(password);
    if (!user || user.passwordHash !== passwordHash) {
      msg.textContent = "账号或密码不对。";
      return;
    }
    setSession(user);
    window.location.href = "./home.html";
  });
}
