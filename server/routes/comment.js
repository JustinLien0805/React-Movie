import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateToken } from "../middleware/AuthMiddleware";
const prisma = new PrismaClient();

const router = express.Router();

// get post's username by fk uid on post
router.post("/postUsername", async (req, res) => {
  const { uid } = req.body;
  const username = await prisma.User.findUnique({
    where: {
      user_id: uid,
    },
    select: {
      username: true,
    },
  });
  res.json(username);
});

router.post("/likePost", validateToken, async (req, res) => {
  const { pid } = req.body;
  const uid = req.user.id;
  //req.user.id from middleware
  const likePost =
    await prisma.$queryRaw`INSERT INTO mydb.Like (Post_post_id, User_user_id) VALUES (${pid}, ${uid});`;
  res.json("success likeing post");
});

router.post("/removeLike", validateToken, async (req, res) => {
  const { pid } = req.body;
  const uid = req.user.id;
  const removeLike =
    await prisma.$queryRaw`DELETE FROM mydb.Like WHERE (Post_post_id = ${pid} ) and (User_user_id = ${uid});`;
  res.json("success remove likeing post");
});

router.post("/checkLike", validateToken, async (req, res) => {
  const { pid } = req.body;
  const uid = req.user.id;
  const checkLike =
    await prisma.$queryRaw`SELECT * FROM mydb.Like where Post_post_id = ${pid} and User_user_id = ${uid} ;`;
  if (checkLike.length > 0) {
    res.json(`user like the post ${pid}, ${uid}`);
  }
});

// count total likes for post
router.post("/totalLikes", async (req, res) => {
  const { pid } = req.body;
  const likes =
    await prisma.$queryRaw`SELECT count(*) as 'likes' FROM mydb.Like where Post_post_id = ${pid}`;
  res.json(likes);
});

export { router as commentRouter };
