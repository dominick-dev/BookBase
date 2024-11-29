import React from "react";
import { Button, Grid } from "@mui/material";

const SocialLoginButtons = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  const handleFacebookLogin = () => {
    window.location.href = "http://localhost:8080/auth/facebook";
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleGoogleLogin}
        >
          Google
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleFacebookLogin}
        >
          Facebook
        </Button>
      </Grid>
    </Grid>
  );
};

export default SocialLoginButtons;
