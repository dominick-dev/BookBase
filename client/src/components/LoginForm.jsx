import { useState } from "react";
import { TextField, Button, Grid, Divider, Alert } from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      // save token to local storage
      localStorage.setItem("token", response.data.token);
      console.log("Login successful", response.data);
      // alert("Login successful");
      alert("Login successful");
      // redirect to home page
      window.location.href = "/";
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Login failed");
      } else {
        // network error
        setError("Unexpected error occurred");
      }
      console.error("Error during login", error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth variant="contained" color="primary" type="submit">
            Login
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }}>Or login with</Divider>
        </Grid>
        <Grid item xs={12}>
          <SocialLoginButtons />
        </Grid>
      </Grid>
    </form>
  );
};

export default LoginForm;
