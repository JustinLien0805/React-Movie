import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import { validateToken } from "./middleware/AuthMiddleware";
const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

// choose port
app.listen(3001, () => {
  console.log("server run on port 3001");
});

// ******************* Login and Registration *********************************
// registration auth
app.post("/registration", async (req, res) => {
  // get data from request
  const { username, password, phone, email, dob, isAdmin } = req.body;
  // check if user exists
  const userExists = await prisma.User.count({
    where: {
      OR: [{ phoneNumber: phone }, { email: email }],
    },
  });
  // if user not exists, create user
  if (userExists === 0) {
    const user = await prisma.User.create({
      data: {
        password: password,
        email: email,
        username: username,
        phoneNumber: phone,
        dateOfBirth: dob.substring(0, 10),
        is_admin: isAdmin,
      },
    });
    res.json({ result: "Registration success" });
  } else {
    res.json({ result: "This email or phone number is already registered" });
  }
});

// login auth
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.User.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) return res.json({ result: "user not found" });
  if (user.password !== password) return res.json({ result: "wrong password" });
  const accessToken = sign(
    { username: user.username, id: user.user_id },
    "secret"
  );
  res.json({
    result: "successful login",
    accessToken: accessToken,
    userId: user.user_id,
    is_Admin: user.is_admin,
  });
});

// ************************ Home ***********************************************
// get movies by search
app.post("/search", async (req, res) => {
  const { movieName } = req.body;
  const movies = await prisma.Movie.findMany({
    where: {
      mName: {
        contains: movieName,
      },
    },
  });

  res.json(movies);
});

// select movie's average rating
app.post("/avg", async (req, res) => {
  const { mid } = req.body;
  const avg = await prisma.Rate.aggregate({
    _avg: {
      score: true,
    },
    where: {
      Movie_movie_id: parseInt(mid),
    },
  });
  res.json(avg);
});

// select moives by genre
app.post("/genre", async (req, res) => {
  const { genre } = req.body;
  const movies = await prisma.Movie.findMany({
    where: {
      genre: genre,
    },
  });
  res.json(movies);
});

// recommand movie
app.get("/recommand", async (req, res) => {
  const recommand =
    await prisma.$queryRaw`SELECT  Movie_movie_id, count(*) as 'posts' FROM mydb.Post group by Movie_movie_id limit 10;`;
  console.log(recommand[0].Movie_movie_id);
  let movies = [];
  for (let i = 0; i < recommand.length; i++) {
    const movie = await prisma.Movie.findUnique({
      where: { movie_id: recommand[i].Movie_movie_id },
    });
    movies.push(movie);
  }
  res.json(movies);
});
//  ************************** Detail **********************************
// get specific movie and posts by id
app.post("/searchById", async (req, res) => {
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

// get post's username by fk uid on post
app.post("/postUsername", async (req, res) => {
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

// post comment and get updated comments
app.post("/postComment", validateToken, async (req, res) => {
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

//  ************************** Comment Like **********************************
app.post("/likePost", validateToken, async (req, res) => {
  const { pid } = req.body;
  const uid = req.user.id;
  //req.user.id from middleware
  const likePost =
    await prisma.$queryRaw`INSERT INTO mydb.Like (Post_post_id, User_user_id) VALUES (${pid}, ${uid});`;
  res.json("success likeing post");
});

app.post("/removeLike", validateToken, async (req, res) => {
  const { pid } = req.body;
  const uid = req.user.id;
  const removeLike =
    await prisma.$queryRaw`DELETE FROM mydb.Like WHERE (Post_post_id = ${pid} ) and (User_user_id = ${uid});`;
  res.json("success remove likeing post");
});

app.post("/checkLike", validateToken, async (req, res) => {
  const { pid } = req.body;
  const uid = req.user.id;
  const checkLike =
    await prisma.$queryRaw`SELECT * FROM mydb.Like where Post_post_id = ${pid} and User_user_id = ${uid} ;`;
  if (checkLike.length > 0) {
    res.json(`user like the post ${pid}, ${uid}`);
  }
});

// delete post and update posts
app.post("/deletePost", validateToken, async (req, res) => {
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
app.post("/rateMovie", validateToken, async (req, res) => {
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
app.post("/checkMovieRate", validateToken, async (req, res) => {
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

// count total likes for post
app.post("/totalLikes", async (req, res) => {
  const { pid } = req.body;
  const likes =
    await prisma.$queryRaw`SELECT count(*) as 'likes' FROM mydb.Like where Post_post_id = ${pid}`;
  res.json(likes);
});
