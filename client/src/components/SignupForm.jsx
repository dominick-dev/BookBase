import React, { useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import SocialLoginButtons from "./SocialLoginButtons";

const SignupForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    // call API to register
  };

  return (
    <form onSubmit={handleSignup}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            required
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
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Grid>
        {error && (
          <Grid item xs={12}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button fullWidth type="submit" variant="contained" color="primary">
            Sign Up
          </Button>
        </Grid>
        <Grid item xs={12}>
          <SocialLoginButtons />
        </Grid>
      </Grid>
    </form>
  );
};

export default SignupForm;
