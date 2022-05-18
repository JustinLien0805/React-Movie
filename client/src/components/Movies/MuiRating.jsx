import React, { useState } from "react";
import { Stack, Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const MuiRating = ({ movie, rating, handleClick }) => {
  const [value, setValue] = useState(0);
  const handleRating = (event, newValue) => {
    setValue(newValue);
    rating(newValue);
    handleClick();
  };

  return (
    <Stack spacing={2}>
      <Rating
        name={movie.mName}
        value={value}
        onChange={handleRating}
        emptyIcon={
          <StarIcon
            style={{ opacity: 0.55, color: "white" }}
            fontSize="inherit"
          />
        }
      />
    </Stack>
  );
};

export default MuiRating;
