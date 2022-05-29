import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user";
import { homeRouter } from "./routes/home";
import { detailRouter } from "./routes/detail";
import { commentRouter } from "./routes/comment";

const app = express();

app.use(cors());
app.use(express.json());

// choose port
app.listen(3001, () => {
  console.log("server run on port 3001");
});

// ******************* Login and Registration *********************************
app.use("/user", userRouter);

// ************************ Home ***********************************************
app.use("/home", homeRouter);

//  ************************** Detail **********************************
app.use("/detail", detailRouter);

//  ************************** Comment/Like **********************************
app.use("/comment", commentRouter);
