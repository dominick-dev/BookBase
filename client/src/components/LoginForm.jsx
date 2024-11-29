import React from "react";
import { TextField, Button, Grid } from '@mui/material';
import SocialLoginButtons from "./SocialLoginButtons";

const LoginForm = () => {
    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login form submitted");
        // api call to login
    };

    return (
        <form onSubmit={handleLogin}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        type="email"
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        required
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                    >
                        Login
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <SocialLoginButtons />
                </Grid>
            </Grid>
        </form>
    );
};

export default LoginForm;