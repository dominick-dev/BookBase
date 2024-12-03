import { useEffect, useState } from "react";
import { Tabs, Tab, Typography, Box } from "@mui/material";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import '../styles/AuthPage.css';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("User already logged in, redirecting to home page");
      alert("User already logged in, redirecting to home page");
      window.location.href = "/";
    }
  }, []);

  return (
    <Box className="auth-container">
      <div className="banner"></div>
      <Typography variant="h4" className="auth-header">
        welcome to bookbase 📚
      </Typography>
      <Tabs value={activeTab} onChange={handleTabChange} className="auth-tabs" centered>
        <Tab label="Login" className="auth-tab" />
        <Tab label="Signup" className="auth-tab" />
      </Tabs>
      <Box className="auth-form">{activeTab === 0 ? <LoginForm /> : <SignupForm />}</Box>
    </Box>
  );
};

export default AuthPage;
