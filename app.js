// app.js
// 변경사항
import express from "express";
import connect from "./schemas/index.js";
import todosRouter from "./routes/todos.router.js";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";

const app = express();
const PORT = 3000;

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json()); // 미들웨어 1
app.use(express.urlencoded({ extended: true })); // 미들웨어 2

// static Middleware, express.static()을 사용하여 정적 파일을 제공합니다.
// ./assets폴더를 바탕으로 서빙을 할 것입니다.
app.use(express.static("./assets")); // 미들웨어 3

// 미들웨어 4
// 모든 요청을 로그로 남기기
app.use((req, res, next) => {
  // 미들웨어 4
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
});

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

// 미들웨어 5 라우터 설정
app.use("/api", [router, todosRouter]);

// 에러 처리 미들웨어 등록
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, "포트로 서버가 열렸어요!");
});
