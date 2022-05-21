import React from "react";
import { useEffect, useState } from "react";
import Movie from "../Movies/Movie";
import "../..//App.css";
import axios from "axios";
import { Box, Button, Grid } from "@mui/material";

const Home = () => {
  const [movieName, setMovieName] = useState("");
  const [avgs, setAvgs] = useState([]);
  // default value will be leaderboard
  const [movies, setMovies] = useState([]);
  const searchMovie = async (movieName) => {
    await axios
      .post("http://localhost:3001/search", movieName)
      .then((response) => {
        setMovies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    searchMovie(movieName);
  }, [movieName]);

  useEffect(async () => {
    const promises = movies.map(async (movie) => {
      const score = await axios.post("http://localhost:3001/avg", {
        mid: movie.movie_id,
      });
      console.log(score);
      return score.data._avg.score;
    });
    const scores = await Promise.all(promises);
    setAvgs(scores);
  }, [movies]);

  return (
    <>
      <div className="header">
        <Grid container style={{ width: "100%" }}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <h1>Movie Search</h1>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                justifyContent: "flex-start",
                p: 1,
                m: 1,
                borderRadius: 5,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  width: 125,
                  color: "#f9d3b4",
                  borderColor: "#f9d3b4",
                  "&:hover": {
                    backgroundColor: "#f9d3b4",
                    color: "#212426",
                    borderColor: "#f9d3b4",
                  },
                }}
              >
                login
              </Button>
            </Box>
          </Grid>
        </Grid>
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Search a movie"
          value={movieName}
          onChange={(e) => {
            setMovieName(e.target.value);
          }}
        />
      </div>
      {movieName.length > 0 && movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie, index) => (
            <Movie movie={movie} key={movie.movie_id} avg={avgs[index]} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>no movies found</h2>
        </div>
      )}
    </>
  );
};

export default Home;
