// app.js

import express from "express";

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  console.log("첫번째 미들웨어");
  next();
});

app.use((req, res, next) => {
  console.log("두번째 미들웨어");
  next();
});

app.get("/", (req, res, next) => {
  console.log("GET / 요청이 발생했습니다.");
  next();
});

app.use((req, res, next) => {
  console.log("세번째 미들웨어");
  res.json({ message: "Hi" });
  next();
});

app.use((req, res, next) => {
  console.log("네번째 미들웨어");
  res.json({ message: "마지막 미들웨어 입니다." });
});

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});

/* 로컬 호스트
{
	"message": "Hi"
}
    */

/*console.log 출력
3000 포트로 서버가 열렸어요!
첫번째 미들웨어
두번째 미들웨어
세번째 미들웨어
*/
