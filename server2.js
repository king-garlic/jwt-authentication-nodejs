require("dotenv").config();
const express = require("express");
const app = express();
app.listen(4000);

app.use(express.json());

app.get("/posts", authenticateToken, (req, res) => {
  console.log("4000 포트 서버 : req.user", req.user);
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
