import { useState } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  phone: yup
    .string("Enter your phone")
    .min(10, "Phone should be of minimum 10 characters length")
    .required("Email is required"),
  username: yup
    .string("Enter your username")
    .min(8, "Username should be of minimum 8 characters length")
    .required("Username is required"),
  dob: yup
    .string("Enter your Date of Birth")
    .required("Date of Birth is required"),
});

const SignUp = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#f9d3b4",
      },
      text: {
        primary: "#f9d3b4",
      },
    },
  });

  const [isAdmin, setIsAdmin] = useState(0);

  let navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
      phone: "",
      dob: "",
      isAdmin: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      // axios posts to database
      values.isAdmin = isAdmin;
      axios
        .post("http://localhost:3001/registration", values)
        .then((response) => {
          console.log(response.data);
          if (response.data.result === "Registration success") {
            alert("register success");
            navigate("/");
          } else {
            alert(response.data.result);
          }
        })
        .catch((error) => {
          console.error(error);
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
        <ThemeProvider theme={theme}>
          <Typography variant="h1" align="center" sx={{ mb: 7 }}>
            Movie
          </Typography>
          <TextField
            type="text"
            label="Username"
            id="username"
            name="username"
            size="big"
            margin="dense"
            required
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
            sx={{
              width: 400,
              mb: 2,
              input: { color: "#f9d3b4" },
              label: { color: "#f9d3b4" },
              fieldset: { borderColor: "#f9d3b4" },
            }}
          />
          <TextField
            type="text"
            label="Password"
            id="password"
            name="password"
            size="big"
            margin="dense"
            required
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            sx={{
              width: 400,
              mb: 2,
              input: { color: "#f9d3b4" },
              label: { color: "#f9d3b4" },
              fieldset: { borderColor: "#f9d3b4" },
            }}
          />
          <TextField
            type="text"
            label="Email"
            id="email"
            name="email"
            size="big"
            margin="dense"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            sx={{
              width: 400,
              mb: 2,
              input: { color: "#f9d3b4" },
              label: { color: "#f9d3b4" },
              fieldset: { borderColor: "#f9d3b4" },
            }}
          />
          <TextField
            type="text"
            label="Phone"
            id="phone"
            name="phone"
            size="big"
            margin="dense"
            required
            value={formik.values.phone}
            onChange={formik.handleChange}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
            sx={{
              width: 400,
              mb: 2,
              input: { color: "#f9d3b4" },
              label: { color: "#f9d3b4" },
              fieldset: { borderColor: "#f9d3b4" },
            }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              disableFuture
              label="Date of Birth"
              views={["year", "month", "day"]}
              onChange={(val) => {
                //val is the variable which contain the selected date
                //You can set it anywhere
                formik.setFieldValue("dob", val);
              }}
              id="dob"
              name="dob"
              value={formik.values.dob}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  error={formik.touched.dob && Boolean(formik.errors.dob)}
                  helperText={formik.touched.dob && formik.errors.dob}
                  sx={{
                    width: 400,
                    mb: 2,
                    svg: { color: "#f9d3b4" },
                    input: { color: "#f9d3b4" },
                    label: { color: "#f9d3b4" },
                    fieldset: { borderColor: "#f9d3b4" },
                  }}
                />
              )}
            />
          </LocalizationProvider>
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
            Sign Up
          </Button>
          <Button
            color="secondary"
            sx={{
              width: 250,
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
            to={"/"}
          >
            already have an Account?
          </Button>
        </ThemeProvider>
      </Box>
    </>
  );
};

export default SignUp;
