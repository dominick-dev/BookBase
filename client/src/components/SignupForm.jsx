import { useState } from "react";
import { TextField, Button, Grid, Divider, Alert } from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";
import axios from "axios";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:8080/auth/register", {
        email,
        password,
      });

      setSuccess("Signup successful! Please login.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Registration failed");
      } else {
        setError("Unexpected error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <Grid container spacing={2}>
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            variant="outlined"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button fullWidth type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }}>Or sign up with</Divider>
        </Grid>
        <Grid item xs={12}>
          <SocialLoginButtons />
        </Grid>
      </Grid>
    </form>
  );
};

export default SignupForm;
