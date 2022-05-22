require("dotenv").config();
const express = require("express");
const app = express();
app.listen(3000);

app.use(express.json());

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
app.get("/posts", authenticateToken, (req, res) => {
  console.log("3000 포트 서버 : req.user", req.user);
  //   console.log("res", res);
  res.json(posts.filter((post) => post.username === req.user.name));
});

const jwt = require("jsonwebtoken");

// delete login

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
      req.user = user;
    }
    req.user = user;
    next();
  });
}
