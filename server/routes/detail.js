import express from "express";
import { PrismaClient } from "@prisma/client";
import { validateToken } from "../middleware/AuthMiddleware";
const prisma = new PrismaClient();

const router = express.Router();

// get specific movie and posts by id
router.post("/searchById", async (req, res) => {
  const { mid } = req.body;
  const movie = await prisma.Movie.findUnique({
    where: {
      movie_id: parseInt(mid),
    },
  });

  let posts = await prisma.Post.findMany({
    where: {
      Movie_movie_id: parseInt(mid),
    },
  });
  res.json({ movie: movie, posts: posts });
});

// post comment and get updated comments
router.post("/postComment", validateToken, async (req, res) => {
  const { mid, content } = req.body;
  const uid = req.user.id;
  const createPost = await prisma.Post.create({
    data: {
      content: content,
      User_user_id1: parseInt(uid),
      Movie_movie_id: parseInt(mid),
    },
  });

  const posts = await prisma.Post.findMany({
    where: {
      Movie_movie_id: parseInt(mid),
    },
  });

  res.json({ createPost: createPost, posts: posts });
});

// delete post and update posts
router.post("/deletePost", validateToken, async (req, res) => {
  const { pid, mid } = req.body;
  const deletePost = prisma.Post.deleteMany({
    where: {
      post_id: parseInt(pid),
    },
  });
  const deletePostLike = prisma.$queryRaw`DELETE FROM mydb.Like WHERE  (Post_post_id = ${pid} )`;
  const transaction = await prisma.$transaction([deletePostLike, deletePost]);
  const posts = await prisma.Post.findMany({
    where: {
      Movie_movie_id: parseInt(mid),
    },
  });
  res.json({ posts: posts });
});

// rate movie
router.post("/rateMovie", validateToken, async (req, res) => {
  const { mid, rating } = req.body;
  const uid = req.user.id;
  // check if user had rated the movie
  const checkRate = await prisma.Rate.findMany({
    where: {
      User_user_id: uid,
      Movie_movie_id: parseInt(mid),
    },
    select: {
      rate_id: true,
    },
  });

  if (checkRate?.length > 0) {
    const rid = checkRate[0].rate_id;
    const rateUpdate = await prisma.Rate.update({
      where: {
        rate_id_User_user_id_Movie_movie_id: {
          rate_id: rid,
          User_user_id: uid,
          Movie_movie_id: parseInt(mid),
        },
      },
      data: {
        score: rating,
      },
    });
    console.log(rateUpdate);
    res.json("success updata rate");
  } else if (checkRate?.length === 0) {
    const checkRate = await prisma.Rate.create({
      data: {
        User_user_id: uid,
        Movie_movie_id: parseInt(mid),
        score: rating,
      },
    });
    res.json("success create rate");
  }
});

// check if user had rated the movie
router.post("/checkMovieRate", validateToken, async (req, res) => {
  const { mid } = req.body;
  const uid = req.user.id;
  const checkRate = await prisma.Rate.findMany({
    where: {
      User_user_id: uid,
      Movie_movie_id: parseInt(mid),
    },
    select: {
      score: true,
    },
  });
  if (checkRate.length > 0) {
    res.json({ rating: checkRate[0].score });
  }
});

export { router as detailRouter };
