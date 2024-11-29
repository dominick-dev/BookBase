import React, { useState } from "react";
import { Tabs, Tab, Typography, TextField, Button, Grid } from "@material-ui/core";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 500,
                mx: "auto",
                mt: 8,
                p: 4,
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <Typography variant="h4" align="center" mb={2}>
                Bookbase Authentication
            </Typography>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Login"/>
                <Tab label="Signup"/>
            </Tabs>
            <Box mt={4}>
                {activeTab === 0 ? <LoginForm/> : <SignupForm/>}
            </Box>
        </Box>
    );
}

export default AuthPage;
