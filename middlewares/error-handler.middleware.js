// /middlewares/error-handler.middleware.js

export default function (err, req, res, next) {
  console.error(err);

  // Joi 검증에서 에러가 발생하면, 클라이언트에게 에러 메시지를 전달합니다.
  if (err.name === "ValidationError") {
    return res.status(400).json({ errorMessage: err.message });
  }

  // 그 외의 에러가 발생하면, 서버 에러로 처리합니다.
  return res
    .status(500)
    .json({ errorMessage: "서버에서 에러가 발생하였습니다." });
}
