import { Stack, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
const Movie = ({ movie, avg }) => {
  let navigate = useNavigate();
  const navigateDetail = () => {
    navigate(`/detail/${movie.movie_id}`);
  };

  return (
    <>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        onClick={navigateDetail}
      >
        <div className="movie">
          <div>
            <p>{movie.releaseYear}</p>
          </div>
          <div>
            <img
              src={movie.poster !== "N/A" ? movie.poster : movie.mName}
              alt={movie.mName}
            />
          </div>
          <div>
            <span>{movie.genre}</span>
            <h3>{movie.mName}</h3>
          </div>
        </div>

        <Stack spacing={2}>
          <Rating
            name={movie.mName}
            value={avg || 5}
            readOnly
            percision={0.5}
            sx={{
              fontSize: "2.2rem",
            }}
            emptyIcon={
              <StarIcon
                style={{ opacity: 0.55, color: "white" }}
                fontSize="inherit"
              />
            }
          />
        </Stack>
      </Stack>
    </>
  );
};

export default Movie;
