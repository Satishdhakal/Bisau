import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../assets/logo.png";
import "./Signup.css";

import { useData } from "../context/ObjectContext";


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignUp() {
  const { data } = useData();
  const [error, setError] = useState();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const Fdata = new FormData(event.currentTarget);

    const fullName = Fdata.get("name");
    const email = Fdata.get("email");
    const phoneNumber = Fdata.get("phoneNumber");
    const password = Fdata.get("password");
    const confirmPassword = Fdata.get("confirmPassword");

    if (password != confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!/^[a-zA-Z ]+$/.test(fullName)) {
      setError("Name should not contain special characters and numbers");
      return;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setError("Invalid email");
      return;
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
      setError("Invalid password");
      return;
    }
    setError("");
    try {
      console.log(await data.signUp(fullName, email, phoneNumber, password));
      navigator.navigate('/main');
    } catch (e) {
      setError("Something went wrong");
      console.error(e);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          backgroundColor: "#f9f9f9",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "400px",
          }}
        >
          <img alt="Bisau Logo" style={{ width: "50px" }} src={Logo} />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mt: 2,
              mb: 7,
            }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phoneNumber"
              label="Phone number"
              name="phoneNumber"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
            />
            <Button
              className="signup_button"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#fead01" }}
            >
              Sign Up
            </Button>
            {error}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  // to="/signin"
                  style={{
                    textDecoration: "none",
                  }}
                  onClick={() => navigate('/signin')}
                  variant="body2"
                >
                  <span
                    style={{
                      textDecoration: "none !important",
                      color: "#1b1b1b",
                    }}
                  >
                    Already have an account? Sign In
                  </span>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
