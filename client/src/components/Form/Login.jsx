import { useContext } from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { AdminContext } from "../Helper/Context";

const EmailTextField = styled(TextField)({
  label: {
    color: "#f9d3b4",
  },
  "& label.Mui-focused": {
    color: "#f9d3b4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#f9d3b4",
  },
  "& .MuiOutlinedInput-root": {
    color: "#f9d3b4",
    "& fieldset": {
      borderColor: "#f9d3b4a7",
    },
    "&:hover fieldset": {
      borderColor: "#f9d3b4a7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f9d3b4",
    },
  },
});
const PasswordTextField = styled(TextField)({
  label: {
    color: "#f9d3b4",
  },
  "& label.Mui-focused": {
    color: "#f9d3b4",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#f9d3b4",
  },
  "& .MuiOutlinedInput-root": {
    color: "#f9d3b4",
    "& fieldset": {
      borderColor: "#f9d3b4a7",
    },
    "&:hover fieldset": {
      borderColor: "#f9d3b4a7",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f9d3b4",
    },
  },
});

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  let navigate = useNavigate();
  const [admin, setAdmin] = useContext(AdminContext);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // axios posts to database
      axios
        .post("http://localhost:3001/user/login", values)
        .then((response) => {
          if (response.data.result === "successful login") {
            alert("login success");
            navigate("/movie");
            sessionStorage.setItem("accessToken", response.data.accessToken);
            // sessionStorage.setItem("userId", response.data.userId)
            setAdmin(response.data.is_Admin);
          } else {
            alert(response.data.result);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  return (
    <>
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyConstent: "center",
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <Typography variant="h1" align="center" sx={{ mb: 10 }}>
          Movie
        </Typography>
        <EmailTextField
          type="text"
          label="Email"
          id="email"
          name="email"
          size="big"
          sx={{ width: 400, mb: 1 }}
          margin="dense"
          required
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        ></EmailTextField>
        <PasswordTextField
          label="Password"
          id="password"
          name="password"
          size="big"
          sx={{ width: 400, mb: 1 }}
          margin="dense"
          type="Password"
          autoComplete="current-password"
          required
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        ></PasswordTextField>
        <Button
          type="submit"
          variant="outlined"
          color="secondary"
          sx={{
            width: 200,
            color: "#f9d3b4",
            borderColor: "#f9d3b4",
            "&:hover": {
              backgroundColor: "#f9d3b4",
              color: "#212426",
              borderColor: "#f9d3b4",
            },
            mt: 2,
            mb: 1,
          }}
        >
          login
        </Button>
        <Button
          color="secondary"
          sx={{
            width: 200,
            color: "#f9d3b4",
            borderColor: "#f9d3b4",
            "&:hover": {
              backgroundColor: "#f9d3b4",
              color: "#212426",
              borderColor: "#f9d3b4",
            },
            mt: 1,
          }}
          component={Link}
          to={"/signUp"}
        >
          Create an Account
        </Button>
      </Box>
    </>
  );
};

export default Login;
