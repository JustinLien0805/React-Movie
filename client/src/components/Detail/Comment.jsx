import {
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Box,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { AdminContext } from "../Helper/Context";

const theme = createTheme({
  palette: {
    text: {
      primary: "white",
    },
    background: {
      paper: "#424242",
    },
  },
});
const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
  "& .MuiRating-iconEmpty": {
    color: "gray",
  },
});
const Comment = ({ info, handleDelete }) => {
  const id = { uid: info.User_user_id1 };
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(0);
  const [admin, setAdmin] = useContext(AdminContext);
  const [likes, setLikes] = useState(0);
  useEffect(() => {
    axios
      .post("http://localhost:3001/postUsername", id)
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.log(error);
      });

    // check if user like the post
    axios
      .post(
        "http://localhost:3001/checkLike",
        { pid: info.post_id },
        {
          headers: { accessToken: sessionStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.result) {
          setRating(0);
        } else {
          setRating(1);
        }
      });
    // total likes
    axios
      .post("http://localhost:3001/totalLikes", { pid: info.post_id })
      .then((response) => {
        console.log(response.data);
        setLikes(response.data[0].likes);
      });
  }, []);

  // like post
  const handleLike = (event, newValue) => {
    if (newValue === 1) {
      axios
        .post(
          "http://localhost:3001/likePost",
          { pid: info.post_id },
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
    } else {
      //remove Like
      axios
        .post(
          "http://localhost:3001/removeLike",
          { pid: info.post_id },
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
    }
  };

  useEffect(() => {
    axios
      .post("http://localhost:3001/totalLikes", { pid: info.post_id })
      .then((response) => {
        console.log(response.data);
        setLikes(response.data[0].likes);
      });
  }, [rating]);
  return (
    <>
      <ThemeProvider theme={theme}>
        <Card sx={{ m: 2 }} style={{ borderRadius: 10, width: "100%" }}>
          <CardHeader
            title={username}
            action={
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StyledRating
                  max={1}
                  icon={<FavoriteIcon fontSize="inherit" />}
                  emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                  value={rating}
                  onChange={handleLike}
                />
                <Typography variant="h5" sx={{ ml: 1 }}>
                  {likes}
                </Typography>
                {admin === 1 && (
                  <IconButton
                    aria-label="close"
                    sx={{ color: "#f9d3b4" }}
                    onClick={() => handleDelete(info.post_id)}
                  >
                    <DeleteIcon sx={{ fontSize: "inherit" }} />
                  </IconButton>
                )}
              </Box>
            }
          />
          <CardContent>
            <Typography variant="h5">{info.content}</Typography>
          </CardContent>
        </Card>
      </ThemeProvider>
    </>
  );
};

export default Comment;
