import * as React from "react";
import { useRef, useState } from "react";
import { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useData } from "../context/ObjectContext";
import Logo from "../assets/logo.png";
import { hover } from "@testing-library/user-event/dist/hover";
import "./Signin.css";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Bisau
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme({
  typography: {
    fontFamily: ['"Roboto"'].join(","),
    fontColor: "#1b1b1b",
  },
});

export default function SignIn() {
  const { data } = useData();
  const [error, setError] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    data.setAuthCallBack((user) => console.log(user));
  }, []);

  // HANDLE SUBMIT FUNCTION
  const handleSubmit = async (event) => {
    event.preventDefault();
    const Fdata = new FormData(event.currentTarget);
    const email = Fdata.get("email");
    const password = Fdata.get("password");

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
      await data.logIn(email, password);
      navigate('/main');

    } catch (e) {
      console.error(e);
      setError("Something went wrong");
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
              mb: 12.5,
            }}
          >
            Sign in
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              ref={emailRef}
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
              ref={passwordRef}
            />
            <span style={{ color: "rgb(200, 0, 0)" }}>{error}</span>
            <br />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              className="signin_button"
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                color: "#1b1b1b",
                fontWeight: 500,
                backgroundColor: "#fead01",
                fontFamily: "Roboto",
              }}
            >
              Sign In
            </Button>
            <Grid
              container
              sx={{
                mt: 2,
              }}
            >
              <Grid item xs>
                <Link
                  href="#"
                  variant="body2"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      color: "#1b1b1b",
                    }}
                  >
                    Forgot password?
                  </span>
                </Link>
              </Grid>
              <Grid item>
                <Link
                  to="/signup"
                  style={{
                    textDecoration: "none",
                  }}
                  variant="body2"
                >
                  <span
                    style={{
                      textDecoration: "none !important",
                      color: "#1b1b1b",
                    }}
                  >
                    Don't have an account? Sign Up
                  </span>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright
          sx={{ justifySelf: "center", position: "absolute", bottom: "20px" }}
        />
      </Container>
    </ThemeProvider>
  );
}
