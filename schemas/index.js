// schemas/index.js  mongoose 연결

import mongoose from "mongoose";

const connect = () => {
  mongoose
    .connect(
      //대여한 ID, Password, 주소에 맞게끔 수정해주세요!
      "mongodb+srv://Introduction_nodejs:Introduction_nodejs@introduction-mongo.cewv5.mongodb.net/?retryWrites=true&w=majority&appName=Introduction-mongo",
      {
        dbName: "todo_memo", // todo_memo 데이터베이스명을 사용합니다.
      },
    )
    // 연결에 성공했을 때
    .then(() => console.log("MongoDB 연결에 성공하였습니다."))
    // 연결에 실패했을 때
    .catch((err) => console.log(`MongoDB 연결에 실패하였습니다. ${err}`));
};

// 서비스 중에 에러 발생
mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
});

export default connect;
