require("dotenv").config();
const express = require("express");
const app = express();
app.listen(3000);
console.log("################ server start with port", 3000);
app.use(express.json());

/**
 *
 */
app.get("/posts", authenticateToken, (req, res) => {
  console.log("3000 포트 서버 : req.user", req.user);
  //   console.log("res", res);
  const posts = [
    {
      username: "sds",
      title: "post 1",
    },
    {
      username: "cns",
      title: "post 2",
    },
  ];
  res.json(posts.filter((post) => post.username === req.user.name));
});

const jwt = require("jsonwebtoken");
app.post("/login", (req, res) => {
  //Authenticate User

  const username = req.body.username;
  const user = { name: username };
  console.log("user=", user);
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken: accessToken });
});

/**
 * 1. header의 authorization 값을 가져와서 Bearer 뒤에 있는 accessToken 값이 없으면 Unauthorized 인증실패
 * 2. accessToken 값 검증 에러 있으면  Forbidden
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  console.log("token=", token);
  if (token === undefined) {
    console.log(
      "3000 포트 서버 : accessToken 값이 없으면 Unauthorized 인증실패 token=",
      token
    );
    return res.sendStatus(401); // Unauthorized
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(
        "3000 포트 서버 : accessToken 값 검증하여 에러 있으면  Forbidden err=",
        err
      );
      return res.sendStatus(403); // Forbidden 검증 에러
    }
    req.user = user;
    next();
    console.log("token 5000 accessToken 검증 성공시 req.user 세팅", req.user);
  });
}
