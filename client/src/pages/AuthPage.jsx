import { useState } from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
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
        welcome to bookbase 📚
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
        <Tab label="Login" />
        <Tab label="Signup" />
      </Tabs>
      <Box mt={4}>{activeTab === 0 ? <LoginForm /> : <SignupForm />}</Box>
    </Box>
  );
};

export default AuthPage;
