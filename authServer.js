require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.listen(5000);

console.log("################ server start with port", 5000);
app.use(express.json());

let refreshTokens = [];

/**
 * 1. refreshToken 이 body에 없으면 401: Unauthorized
 * 2. refreshToken 값 검증하여 에러 있으면  Forbidden
 * 3. 로그인시 저장된 refreshToken 아니면 Forbidden
 * 4. 인증된 refreshToken 으로 accessToken 생성하여 응답
 */
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  console.log("token 5000 refreshToken", refreshToken);
  console.log("token 5000 refreshTokens", refreshTokens);

  if (refreshToken == null) {
    console.log("token 5000 Unauthorized 인증실패: 토큰이 없음");
    return res.sendStatus(401); // 401: Unauthorized
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log("token 5000 Forbidden : refreshToken 인증 실패 err", err);
      return res.sendStatus(403);
    }
    if (!refreshTokens.includes(refreshToken)) {
      console.log("token 5000 Forbidden : 로그인시 저장된 refreshToken 아님");
      return res.sendStatus(403); // Forbidden
    }
    console.log("token 5000 user", user);
    const accessToken = generateAccessToken({ name: user.name });
    console.log("token 5000 accessToken 생성", accessToken);
    res.json({ accessToken: accessToken });
  });
});

/**
 * 사용한 refreshToken 값으로 refreshTokens 에 들어있는 동일한 refreshToken 값 제거
 */
app.delete("/logout", (req, res) => {
  console.log(
    "### logout with port 5000 : #########################",
    req.body.token
  );
  console.log("### logout with port 5000 : req.body.token 1=", req.body.token);

  console.log("### logout with port 5000 : refreshTokens 1=", refreshTokens);
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  console.log("### logout with port 5000 : refreshTokens 2=", refreshTokens);
  res.sendStatus(204);
});

/**
 * 1. username 으로 accessToken, refreshToken 생성
 * 2. refreshTokens에 refreshToken 추가
 * 3. accessToken, refreshToken 응답
 */
app.post("/login", (req, res) => {
  //Authenticate User

  const username = req.body.username;
  const user = { name: username };
  console.log("user=", user);

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);

  console.log("### login with port 5000 : accessToken=", accessToken);
  console.log("### login with port 5000 : refreshToken=", refreshToken);
  console.log("### login with port 5000 : refreshTokens=", refreshTokens);

  console.log("### login with port 5000 : accessToken, refreshToken 응답=");
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

/**
 * accessToken 생성
 */
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
}
