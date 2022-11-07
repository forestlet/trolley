var express = require("express");
var app = express();

app.use(express.static("."));

app.listen(3000, function () {
  //在3000端口启动
  console.info("复制打开浏览器 http://localhost:3000/");
});
