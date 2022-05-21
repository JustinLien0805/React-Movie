import {
  Box,
  Grid,
  Button,
  Rating,
  Typography,
  IconButton,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base";
import Comment from "./Comment";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Detail = () => {
  let { movieid } = useParams();
  const [movie, setMovie] = useState([]);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  let navigate = useNavigate();
  var id = {
    mid: movieid,
    uid: sessionStorage.getItem("userId"),
    content: content,
  };
  useEffect(() => {
    // get movie info and movie's posts
    axios
      .post("http://localhost:3001/searchById", id)
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          setMovie(response.data.movie);
          setPosts(response.data.posts);
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    // check movie rating
    axios
      .post(
        "http://localhost:3001/checkMovieRate",
        {
          mid: movieid,
        },
        {
          headers: { accessToken: sessionStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        if (response.data.result) {
          console.log(response.data.result);
          alert("Error: user didn't login");
        } else {
          console.log(response.data);
          setRating(response.data.rating);
        }
      });
  }, []);

  // submit comment
  const handleSubmit = (e) => {
    e.preventDefault();
    // post comment and validate
    console.log(content);
    axios
      .post("http://localhost:3001/postComment", id, {
        headers: { accessToken: sessionStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.result) {
          console.log(response.data.result);
          alert("Error: user didn't login");
        } else {
          setPosts(response.data.posts);
          setContent("");
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // deletePost
  const handleDelete = (pid) => {
    axios
      .post(
        "http://localhost:3001/deletePost",
        { pid: pid, mid: movieid },
        {
          headers: { accessToken: sessionStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        if (response.data.result) {
          console.log(response.data.result);
          alert("Error: user didn't login");
        } else {
          console.log(response.data);
          setPosts(response.data.posts);
        }
      });
  };

  // handle rate movie
  const handleRating = (event, newValue) => {
    axios
      .post(
        "http://localhost:3001/rateMovie",
        {
          mid: movieid,
          rating: newValue,
        },
        {
          headers: { accessToken: sessionStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        if (response.data.result) {
          console.log(response.data.result);
          alert("Error: user didn't login");
        } else {
          console.log(response.data);
          setRating(newValue);
        }
      });
  };
  const logout = () =>{
    sessionStorage.clear();
    navigate("/")
  }
  return (
    <>
      {/******************** heading ********************/}
      <Grid
        container
        rowSpacing={2}
        columnSpacing={2}
        mt={3}
        style={{ width: "1000px" }}
      >
        <Grid item xs={2}></Grid>
        <Grid item xs={8}>
          <Box
            p={2}
            style={{ height: "100px" }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h1">Movie</Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
          <Box
            style={{ height: "100%" }}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
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
      {/*************  body *********************/}
      <Grid
        container
        rowSpacing={2}
        columnSpacing={2}
        mt={10}
        style={{ width: "1000px", border: "1px solid grey" }}
      >
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
            }}
          >
            <IconButton
              aria-label="close"
              sx={{ color: "#f9d3b4" }}
              component={Link}
              to={"/movie"}
            >
              <CloseIcon
                sx={{
                  fontSize: "2.5rem",
                }}
              />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Grid mt={2}>
            <Box
              p={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyConstent: "center",
              }}
            >
              <Box component="img" alt={movie.mName} src={movie.poster} />
            </Box>
          </Grid>
          <Grid mt={2} style={{ height: "50px" }}>
            <Box
              p={2}
              style={{ height: "50px" }}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h5" color="white">Your Rating</Typography>
              <Rating
                size="large"
                value={rating}
                onChange={handleRating}
                sx={{
                  fontSize: "2.5rem",
                }}
                emptyIcon={
                  <StarIcon
                    style={{
                      opacity: 0.55,
                      color: "white",
                    }}
                    fontSize="inherit"
                  />
                }
              />
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={6} mt={2}>
          <Box p={2} style={{ height: "100%" }}>
            <Typography
              variant="h3"
              align="left"
              sx={{ mb: 3 }}
              style={{ color: "#f9d3b4" }}
            >
              {movie.mName}
            </Typography>
            <Typography
              variant="h5"
              align="left"
              sx={{ mb: 2 }}
              style={{ color: "#f9d3b4" }}
            >
              Genre: {movie.genre}
            </Typography>
            <Typography
              variant="h5"
              align="left"
              sx={{ mb: 2 }}
              style={{ color: "#f9d3b4" }}
            >
              Release Year: {movie.releaseYear}
            </Typography>
            <Typography
              variant="h5"
              align="left"
              sx={{ mb: 2 }}
              style={{ color: "#f9d3b4" }}
            >
              Director: {movie.director}
            </Typography>
            <Typography
              variant="h5"
              align="left"
              sx={{ mb: 2 }}
              style={{ color: "#f9d3b4" }}
            >
              Main Cast: {movie.actor}
            </Typography>
            <Typography
              variant="h5"
              align="left"
              sx={{ mb: 2 }}
              style={{ color: "#f9d3b4" }}
            >
              IMDB Score: {movie.imdbScore}
            </Typography>
            <Typography
              variant="h5"
              align="left"
              sx={{ mb: 2 }}
              style={{ color: "#f9d3b4" }}
            >
              Rotten Tomatoes: {movie.rtScore}
            </Typography>
            <Typography
              component="div"
              variant="h5"
              align="left"
              sx={{ mb: 2 }}
              style={{ color: "#f9d3b4" }}
            >
              Plot:
              <Typography
                variant="subtitle1"
                align="left"
                sx={{ mb: 2 }}
                style={{ color: "#f9d3b4" }}
              >
                {movie.plot}
              </Typography>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} mt={2}>
          <Box
            p={2}
            style={{ height: "100%" }}
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <Typography
              variant="h3"
              align="left"
              sx={{ mb: 3 }}
              style={{ color: "#f9d3b4" }}
            >
              Comment
            </Typography>
            <TextareaAutosize
              minRows={4}
              maxRows={5}
              placeholder="Join the discussion..."
              style={{ width: "100%" }}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
              }}
            ></TextareaAutosize>
            <Button
              type="submit"
              variant="outlined"
              color="secondary"
              fullWidth
              sx={{
                color: "#f9d3b4",
                borderColor: "#f9d3b4",
                "&:hover": {
                  backgroundColor: "#f9d3b4",
                  color: "#212426",
                  borderColor: "#f9d3b4",
                },
                mt: 2,
              }}
            >
              Post
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} mt={2}>
          <Box
            p={2}
            style={{ height: "100%" }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {posts?.map((post) => (
              <Comment
                info={post}
                key={post.post_id}
                handleDelete={handleDelete}
              />
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Detail;
