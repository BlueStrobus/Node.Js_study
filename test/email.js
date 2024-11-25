import Joi from "joi";

// Joi 스키마를 정의합니다.
const schema = Joi.object({
  // email Key는 Joi.string()을 통해 문자열 형식을 가져야 합니다.
  // .email() : joi에서 작성하는 이메일의 패턴을 사용할 수 있습니다.
  // Joi.string().email() : 해당 키가 실제 이메일 형식이어야 한다.
  // .required() : 해당 key는 필수적으로 존재해야 한다.
  email: Joi.string().email().required(),
});

// 검증할 데이터를 정의합니다.
const user = { email: "foo@example.com" };

// schema를 이용해 user 데이터를 검증합니다.
const validation = schema.validate(user);

// 검증 결과값 중 error가 존재한다면 에러 메시지를 출력합니다.
if (validation.error) {
  console.log(validation.error.message);
} else {
  // 검증 결과값 중 error가 존재하지 않는다면, 데이터가 유효하다는 메시지를 출력합니다.
  console.log("Valid Email User!");
}
