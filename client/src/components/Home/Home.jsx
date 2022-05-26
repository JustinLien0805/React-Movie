import React from "react";
import { useEffect, useState } from "react";
import Movie from "../Movies/Movie";
import "../..//App.css";
import axios from "axios";
import { Box, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [movieName, setMovieName] = useState("");
  const [avgs, setAvgs] = useState([]);
  // default value will be leaderboard
  const [movies, setMovies] = useState([]);
  let navigate = useNavigate();
  const genre = ["Action", "Romance", "Sci-Fi", "Comedy", "Drama"];

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
    if (movieName.length !== 0) {
      searchMovie(movieName);
    }
  }, [movieName]);

  // get movie's score
  useEffect(async () => {
    const promises = movies.map(async (movie) => {
      const score = await axios.post("http://localhost:3001/avg", {
        mid: movie.movie_id,
      });
      return score.data._avg.score;
    });
    const scores = await Promise.all(promises);
    setAvgs(scores);
  }, [movies]);

  // logout function
  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const findMovieByGenre = async (e) => {
    await axios
      .post("http://localhost:3001/genre", {
        genre: e.currentTarget.value,
      })
      .then((response) => {
        setMovies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                onClick={logout}
              >
                logout
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
      <Box
        style={{ width: "100%" }}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {genre.map((g) => (
          <Button
            key={g}
            value={g}
            variant="outlined"
            color="secondary"
            sx={{
              m: 2,
              width: 125,
              color: "#f9d3b4",
              borderColor: "#f9d3b4",
              "&:hover": {
                backgroundColor: "#f9d3b4",
                color: "#212426",
                borderColor: "#f9d3b4",
              },
            }}
            onClick={findMovieByGenre}
          >
            {g}
          </Button>
        ))}
      </Box>
      {movieName.length >= 0 && movies?.length > 0 ? (
        <div className="container">
          {movies.map((movie, index) => (
            <Movie movie={movie} key={movie.movie_id} avg={avgs[index]} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>no movie found</h2>
        </div>
      )}
    </>
  );
};

export default Home;
