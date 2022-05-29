import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// get movies by search
router.post("/search", async (req, res) => {
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
router.post("/avg", async (req, res) => {
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
router.post("/genre", async (req, res) => {
  const { genre } = req.body;
  const movies = await prisma.Movie.findMany({
    where: {
      genre: genre,
    },
  });
  res.json(movies);
});

// recommand movie
router.get("/recommand", async (req, res) => {
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

export { router as homeRouter };
