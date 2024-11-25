// /routes/todos.router.js

import express from "express";
import Joi from "joi"; // joi import
import Todo from "../schemas/todo.schema.js";

// 라우터 생성
const router = express.Router();

/**할 일 생성 API 유효성 검사 요구사항
value 데이터는 필수적으로 존재해야한다.
value 데이터는 문자열 타입이어야한다.
value 데이터는 최소 1글자 이상이어야한다.
value 데이터는 최대 50글자 이하여야한다.
유효성 검사에 실패했을 때, 에러가 발생해야한다. = validateAsync로 검증하세요 */

// 할 일 생성 API의 요청 데이터 검증을 위한 Joi 스키마를 정의합니다.
// createTodoSchema는 Joi.object로 value를 검증합니다.
// value는 문자열 타입, 최소 1글자 이상 최대 50글자 이하, 데이터가 필수적으로 존재해야한다.
const createTodoSchema = Joi.object({
  value: Joi.string().min(1).max(50).required(),
});

/** 할일등록 API **/
router.post("/todos", async (req, res, next) => {
  try {
    // 클라이언트에게 전달받은 데이터를 검증합니다.
    // validateAsync : 애러 발생시키기 위해서 비동기메소드로 검증
    const validation = await createTodoSchema.validateAsync(req.body);
    // 검증 성공
    const { value } = validation;

    // 1-5. 데이터 유효성 검사 기능 추가
    if (!value) {
      return res
        .status(400) // 400 : 클라이언트 잘못으로 오류 발생
        .json({ errorMessage: "해야할 일 데이터가 존재하지 않습니다." });
    }

    // 2. 해당하는 마지막 order 데이터를 조회 (MongoDB에서 'order' 값이 가장 높은 '해야할 일')
    const todoMaxOrder = await Todo.findOne().sort("-order").exec();

    // 3. 만약 존재한다면 현재 할 일에 +1, order 데이터가 존재하지 않는다면 1로 할당합니다.('order' 값이 가장 높은 도큐멘트의 1을 추가하거나 없다면, 1을 할당합니다.)
    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    // 4. 해야할 일 등록
    // todo를 실제 인스턴스형식으로 만듦
    const todo = new Todo({ value, order });
    // 실제로 DB에 저장
    await todo.save();

    // 5. 해야할 일을 클라이언트에게 반환
    return res.status(201).json({ todo });
  } catch (error) {
    // 기존의 에러처리 코드를 /middlewares/error-handler.middleware.js로 옮기기

    // Router 다음에 있는 에러 처리 미들웨어를 실행한다.
    next(error);
  }
});

/** 해야할 일 목록 조회 API**/
// API등록은 router에서 합니다.
router.get("/todos", async (req, res, next) => {
  // 1. 해야할 일 목록 조회를 진행한다.
  const todos = await Todo.find().sort("-order").exec();

  // 2. 해야할 일 목록 조회 결과를 클라이언트에게 반환 한다.
  return res.status(200).json({ todos }); // 200 성공
});

/** 순서 변경, 할 일 완료/해제, 할 일 내용 변경 **/
// /:todoId' : 수정해야 할 데이터를 알기 위해 지정. 경로 매개변수
router.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;

  // 완료여부확인을 위해 done 추가
  const { order, done, value } = req.body;

  const currentTodo = await Todo.findById(todoId).exec();
  if (!currentTodo) {
    return res
      .status(404) // 400은 클라이언트 잘못
      .json({ errorMessage: "존재하지 않는 해야할 일 입니다." });
  }

  // 해야할 일 순서 변경
  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec(); // {order}는  {order:order}를 의미함. 객체의 값이라 {}사용
    if (targetTodo) {
      targetTodo.order = currentTodo.order; // order값 바꾸기.. 4->1이면 2,3번은 그대로 있고 4, 1번만 바뀜
      await targetTodo.save();
    }
    // 변경하려는 '해야할 일'의 order 값을 변경합니니다.
    currentTodo.order = order;
  }

  // 할일을 완료한 경우
  if (done !== undefined) {
    // false는 done에 값이 들어가지 않습니다.
    // 변경하려는 '해야할 일'의 doneAt 값을 변경합니다.
    // 위에서 todoId 조회를 위해 사용한 currentTodo필드에 doneAt라는 컬럼에 할당한다
    // 삼항문으로 done의 값이 있는 경우 그 값을 할당 합니다.
    currentTodo.doneAt = done ? new Date() : null;
  }

  /** 해야할 일 수정 */
  if (value) {
    // 변경하려는 '해야할 일'의 내용을 변경합니다.
    currentTodo.value = value;
  }

  // 변경된 '해야할 일'을 저장합니다.
  await currentTodo.save();

  return res.status(200).json({});
});

/** 할 일 삭제 **/
router.delete("/todos/:todoId", async (req, res) => {
  // 삭제할 '해야할 일'의 ID 값을 가져옵니다.
  // todoId : 경로 매개변수인 req.params에서 가져오기
  const { todoId } = req.params;

  // 삭제하려는 '해야할 일'을 가져옵니다.(조회)
  const todo = await Todo.findById(todoId).exec();
  //만약, 해당 ID값을 가진 '해야할 일'이 없다면 에러를 발생시킵니다.
  if (!todo) {
    return res
      .status(404) // 클라이언트 잘못. id 입력 오류
      .json({ errorMessage: "존재하지 않는 todo 데이터입니다." });
  }

  // 조회된 '해야할 일'을 삭제합니다.
  // MongDB의 데이터 id는 '_id'에 있습니다.
  // 코드에서 중복없이 발급되는 데이터 id를 컬럼todoId에 할당하고 있습니다.
  await Todo.deleteOne({ _id: todoId }).exec();

  return res.status(200).json({});
});

export default router;
